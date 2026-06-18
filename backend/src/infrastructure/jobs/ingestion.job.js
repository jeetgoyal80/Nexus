import { ingestionQueue } from "../queues/ingestion.queue.js";

export const enqueueDocumentIngestionJob = async ({ documentId, botId, fileUrl, originalName, sourceId }) => {
  return ingestionQueue.add("ingest-document", {
    documentId,
    botId,
    fileUrl,
    originalName,
    sourceId,
  });
};
