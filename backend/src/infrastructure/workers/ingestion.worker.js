import { Worker, QueueEvents } from "bullmq";
import { env } from "../../config/env.js";
import logger from "../../config/logger.js";
import { connectDB } from "../../config/db.js";
import { redisConnection } from "../redis/redisClient.js";
import { INGESTION_QUEUE_NAME } from "../queues/ingestion.queue.js";
import { documentRepository } from "../../modules/document/repositories/document.repository.js";
import { DOCUMENT_STATUS } from "../../modules/document/constants/document.constants.js";
import { cloudinary } from "../../config/cloudinary.js";

const isCloudinaryPublicUrl = (url) =>
  typeof url === "string" &&
  url.startsWith("https://") &&
  url.includes("res.cloudinary.com/") &&
  url.includes("/raw/upload/") &&
  !url.includes("/s--");

const createProcessingUrl = ({ fileUrl, sourceId }) => {
  if (isCloudinaryPublicUrl(fileUrl)) {
    return {
      url: fileUrl,
      type: "stored-public-url",
    };
  }

  if (sourceId) {
    return {
      url: cloudinary.url(sourceId, {
        resource_type: "raw",
        type: "upload",
        secure: true,
      }),
      type: "generated-public-url",
    };
  }

  return {
    url: fileUrl,
    type: "stored-url-fallback",
  };
};

const createSignedCloudinaryDownloadUrl = ({ sourceId }) => {
  if (!sourceId) {
    return null;
  }

  return cloudinary.utils.private_download_url(sourceId, null, {
    resource_type: "raw",
    type: "upload",
    expires_at: Math.floor(Date.now() / 1000) + 10 * 60,
  });
};

const redactSignedUrl = (url) => {
  if (typeof url !== "string") {
    return url;
  }

  return url.replace(/([?&](api_key|signature|timestamp|expires_at)=)[^&]+/g, "$1[redacted]");
};

const fetchWithTimeout = async (url, options = {}, timeoutMs = 15000) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
};

const assertRagServiceReachable = async () => {
  const healthUrl = `${env.RAG_SERVICE_URL}/health`;

  try {
    const response = await fetchWithTimeout(healthUrl, { method: "GET" }, 5000);

    logger.info("RAG service health check completed", {
      healthUrl,
      status: response.status,
      ok: response.ok,
    });

    if (!response.ok) {
      throw new Error(`RAG service health check failed with status ${response.status}`);
    }
  } catch (error) {
    logger.error("RAG service is unreachable from ingestion worker", {
      healthUrl,
      ragServiceUrl: env.RAG_SERVICE_URL,
      message: error.message,
      cause: error.cause?.message,
    });

    throw new Error(
      `RAG service unreachable at ${env.RAG_SERVICE_URL}. Start FastAPI on this port or fix RAG_SERVICE_URL.`,
    );
  }
};

const preflightCloudinaryUrl = async (url, { urlType }) => {
  try {
    const response = await fetchWithTimeout(
      url,
      {
        method: "GET",
        headers: {
          Range: "bytes=0-0",
        },
      },
      15000,
    );

    const body = !response.ok && response.status !== 206
      ? await response.text().catch(() => "")
      : "";

    logger.info("Cloudinary download preflight completed", {
      url: urlType === "signed-api-download-url" ? redactSignedUrl(url) : url,
      urlType,
      status: response.status,
      ok: response.ok,
      contentType: response.headers.get("content-type"),
      contentLength: response.headers.get("content-length"),
      responseBody: body.slice(0, 300),
    });

    return {
      ok: response.ok || response.status === 206,
      status: response.status,
      body,
    };
  } catch (error) {
    logger.error("Cloudinary URL is unreachable from ingestion worker", {
      url: urlType === "signed-api-download-url" ? redactSignedUrl(url) : url,
      urlType,
      message: error.message,
      cause: error.cause?.message,
    });

    return {
      ok: false,
      status: null,
      body: "",
      error,
    };
  }
};

const callRagIngestionService = async ({ botId, fileUrl, originalName, sourceId }) => {
  let processingUrl = createProcessingUrl({ fileUrl, sourceId, originalName });

  logger.info("Preparing cloud document ingestion", {
    botId,
    originalName,
    sourceId,
    storedCloudinaryUrl: fileUrl,
    generatedDownloadUrl: processingUrl.url,
    resourceType: "raw",
    accessMode: "public",
    processingUrlType: processingUrl.type,
  });

  await assertRagServiceReachable();

  const publicPreflight = await preflightCloudinaryUrl(processingUrl.url, {
    urlType: processingUrl.type,
  });

  if (!publicPreflight.ok && [401, 403].includes(publicPreflight.status) && sourceId) {
    const signedUrl = createSignedCloudinaryDownloadUrl({ sourceId });

    logger.warn("Cloudinary public delivery rejected; retrying with signed API download URL", {
      botId,
      originalName,
      sourceId,
      publicUrl: processingUrl.url,
      publicStatus: publicPreflight.status,
      signedUrl: redactSignedUrl(signedUrl),
    });

    processingUrl = {
      url: signedUrl,
      type: "signed-api-download-url",
    };

    const signedPreflight = await preflightCloudinaryUrl(processingUrl.url, {
      urlType: processingUrl.type,
    });

    if (!signedPreflight.ok) {
      throw new Error(
        `Cloudinary signed download failed before RAG ingestion: status=${signedPreflight.status} body=${signedPreflight.body.slice(0, 300)}`,
      );
    }
  } else if (!publicPreflight.ok) {
    throw new Error(
      `Cloudinary URL fetch failed before RAG ingestion: status=${publicPreflight.status} body=${publicPreflight.body.slice(0, 300)}`,
    );
  }

  let response;

  try {
    response = await fetchWithTimeout(`${env.RAG_SERVICE_URL}/ingest/url`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        botId,
        fileUrl: processingUrl.url,
        originalName,
        sourceId,
      }),
    }, 120000);
  } catch (error) {
    logger.error("Failed to reach RAG ingestion service", {
      ragServiceUrl: env.RAG_SERVICE_URL,
      generatedDownloadUrl:
        processingUrl.type === "signed-api-download-url" ? redactSignedUrl(processingUrl.url) : processingUrl.url,
      cause: error.cause?.message,
      message: error.message,
    });

    throw error;
  }

  const responseBody = await response.text();
  let payload = null;

  try {
    payload = JSON.parse(responseBody);
  } catch {
    payload = null;
  }

  if (!response.ok) {
    logger.error("RAG ingestion service rejected document", {
      status: response.status,
      statusText: response.statusText,
      generatedDownloadUrl:
        processingUrl.type === "signed-api-download-url" ? redactSignedUrl(processingUrl.url) : processingUrl.url,
      responseBody,
    });

    throw new Error(payload?.detail || responseBody || "RAG ingestion service failed");
  }

  return payload;
};

const processIngestionJob = async (job) => {
  const { documentId, botId, fileUrl, originalName, sourceId } = job.data;

  logger.info("Starting document ingestion job", {
    jobId: job.id,
    documentId,
    botId,
  });

  await documentRepository.updateById(documentId, {
    processingStatus: DOCUMENT_STATUS.PROCESSING,
    errorMessage: null,
    processingStartedAt: new Date(),
  });

  try {
    await job.updateProgress(25);
    const result = await callRagIngestionService({ botId, fileUrl, originalName, sourceId });
    await job.updateProgress(100);

    await documentRepository.updateById(documentId, {
      processingStatus: DOCUMENT_STATUS.EMBEDDED,
      chunksCreated: result.chunksCreated,
      vectorsStored: result.vectorsStored,
      processingCompletedAt: new Date(),
      errorMessage: null,
    });

    logger.info("Document ingestion job completed", {
      jobId: job.id,
      documentId,
      botId,
      chunksCreated: result.chunksCreated,
      vectorsStored: result.vectorsStored,
    });

    return result;
  } catch (error) {
    await documentRepository.updateById(documentId, {
      processingStatus: DOCUMENT_STATUS.FAILED,
      errorMessage: error.message,
      processingCompletedAt: new Date(),
    });

    logger.error("Document ingestion job failed", {
      jobId: job.id,
      documentId,
      botId,
      message: error.message,
    });

    throw error;
  }
};

const startWorker = async () => {
  await connectDB();

  const worker = new Worker(INGESTION_QUEUE_NAME, processIngestionJob, {
    connection: redisConnection,
    concurrency: env.INGESTION_WORKER_CONCURRENCY,
  });

  const queueEvents = new QueueEvents(INGESTION_QUEUE_NAME, {
    connection: redisConnection,
  });

  worker.on("ready", () => {
    logger.info("Ingestion worker is ready", {
      queue: INGESTION_QUEUE_NAME,
      concurrency: env.INGESTION_WORKER_CONCURRENCY,
    });
  });

  worker.on("failed", (job, error) => {
    logger.error("Ingestion worker observed failed job", {
      jobId: job?.id,
      message: error.message,
    });
  });

  const shutdown = async (signal) => {
    logger.info(`${signal} received. Shutting down ingestion worker.`);
    await worker.close();
    await queueEvents.close();
    await redisConnection.quit();
    process.exit(0);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
};

startWorker().catch((error) => {
  logger.error("Failed to start ingestion worker", {
    message: error.message,
  });
  process.exit(1);
});
