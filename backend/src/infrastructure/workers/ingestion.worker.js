import { readFile } from "fs/promises";
import { Worker, QueueEvents } from "bullmq";
import { env } from "../../config/env.js";
import logger from "../../config/logger.js";
import { connectDB } from "../../config/db.js";
import { redisConnection } from "../redis/redisClient.js";
import { INGESTION_QUEUE_NAME } from "../queues/ingestion.queue.js";
import { documentRepository } from "../../modules/document/repositories/document.repository.js";
import { DOCUMENT_STATUS } from "../../modules/document/constants/document.constants.js";

const callRagIngestionService = async ({ botId, filePath, originalName }) => {
  const fileBuffer = await readFile(filePath);
  const form = new FormData();
  form.append("botId", botId);
  form.append("file", new Blob([fileBuffer]), originalName);

  const response = await fetch(`${env.RAG_SERVICE_URL}/ingest/document`, {
    method: "POST",
    body: form,
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload?.detail || "RAG ingestion service failed");
  }

  return payload;
};

const processIngestionJob = async (job) => {
  const { documentId, botId, filePath, originalName } = job.data;

  logger.info("Starting document ingestion job", {
    jobId: job.id,
    documentId,
    botId,
  });

  await documentRepository.updateById(documentId, {
    status: DOCUMENT_STATUS.PROCESSING,
    errorMessage: null,
    processingStartedAt: new Date(),
  });

  try {
    await job.updateProgress(25);
    const result = await callRagIngestionService({ botId, filePath, originalName });
    await job.updateProgress(100);

    await documentRepository.updateById(documentId, {
      status: DOCUMENT_STATUS.COMPLETED,
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
      status: DOCUMENT_STATUS.FAILED,
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
