import { apiClient, unwrapApiData } from "@/shared/lib/axios";
import type { KnowledgeDocument } from "../types/document.types";

export const getDocumentStatus = (documentId: string) =>
  apiClient.get(`/documents/${documentId}`).then(unwrapApiData<{ document: KnowledgeDocument }>);
