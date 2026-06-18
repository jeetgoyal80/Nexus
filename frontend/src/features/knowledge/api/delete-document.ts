import { apiClient, unwrapApiData } from "@/shared/lib/axios";
import type { KnowledgeDocument } from "../types/document.types";

export const deleteDocument = (documentId: string) =>
  apiClient
    .delete(`/knowledge/${documentId}`)
    .then(unwrapApiData<{ document: KnowledgeDocument }>);
