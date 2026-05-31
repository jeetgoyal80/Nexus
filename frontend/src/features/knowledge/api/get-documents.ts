import { apiClient, unwrapApiData } from "@/shared/lib/axios";
import type { KnowledgeDocument } from "../types/document.types";

export const getDocuments = (botId: string) =>
  apiClient.get(`/bots/${botId}/documents`).then(unwrapApiData<{ documents: KnowledgeDocument[] }>);
