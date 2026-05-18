import { ingestionQueue } from "../queues/ingestion.queue.js";

export const enqueueDocumentIngestionJob = async ({ documentId, botId, filePath, originalName }) => {
  return ingestionQueue.add("ingest-document", {
    documentId,
    botId,
    filePath,
    originalName,
  });
};
