import { apiClient, unwrapApiData } from "@/shared/lib/axios";
import type { KnowledgeDocument } from "../types/document.types";

export const uploadDocument = ({
  botId,
  file,
  onProgress,
}: {
  botId: string;
  file: File;
  onProgress?: (progress: number) => void;
}) => {
  const body = new FormData();
  body.append("file", file);

  return apiClient
    .post(`/bots/${botId}/documents`, body, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (event) => {
        if (!event.total) return;
        onProgress?.(Math.round((event.loaded / event.total) * 100));
      },
    })
    .then(unwrapApiData<{ document: KnowledgeDocument }>);
};
