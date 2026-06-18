export type KnowledgeDocumentStatus = "uploaded" | "processing" | "embedded" | "failed";

export type KnowledgeDocument = {
  id: string;
  botId: string;
  originalName: string;
  cloudinaryUrl?: string;
  mimeType: string;
  size: number;
  processingStatus: KnowledgeDocumentStatus;
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
