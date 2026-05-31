export type KnowledgeDocumentStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

export type KnowledgeDocument = {
  id: string;
  botId: string;
  originalName: string;
  mimeType: string;
  size: number;
  status: KnowledgeDocumentStatus;
  jobId: string | null;
  chunksCreated: number;
  vectorsStored: number;
  errorMessage: string | null;
  processingStartedAt: string | null;
  processingCompletedAt: string | null;
  createdAt: string;
  updatedAt: string;
};
