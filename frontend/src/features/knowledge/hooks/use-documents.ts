import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getDocuments } from "../api/get-documents";
import { uploadDocument } from "../api/upload-document";
import { deleteDocument } from "../api/delete-document";
import { getApiErrorMessage } from "@/shared/lib/api-error";

export const documentKeys = {
  byBot: (botId: string) => ["documents", botId] as const,
};

export const useDocuments = (botId?: string) =>
  useQuery({
    queryKey: documentKeys.byBot(botId ?? ""),
    queryFn: () => getDocuments(botId!).then((data) => data.documents),
    enabled: Boolean(botId),
    refetchInterval: (query) => {
      const docs = query.state.data;
      return docs?.some((doc) => doc.status === "uploaded" || doc.status === "processing")
        ? 5000
        : false;
    },
  });

export function useUploadDocument(botId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ file, onProgress }: { file: File; onProgress?: (progress: number) => void }) =>
      uploadDocument({ botId: botId!, file, onProgress }),
    onSuccess: () => {
      if (botId) queryClient.invalidateQueries({ queryKey: documentKeys.byBot(botId) });
      toast.success("Document accepted for ingestion");
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Document upload failed")),
  });
}

export function useDeleteDocument(botId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDocument,
    onSuccess: () => {
      if (botId) queryClient.invalidateQueries({ queryKey: documentKeys.byBot(botId) });
      toast.success("Document deleted from cloud storage");
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Document deletion failed")),
  });
}
