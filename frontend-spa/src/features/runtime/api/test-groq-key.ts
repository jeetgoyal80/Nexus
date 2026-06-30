import { apiClient, unwrapApiData } from "@/shared/lib/axios";

export const testGroqKey = (apiKey: string) =>
  apiClient.post("/runtime/test-key", { apiKey }).then(unwrapApiData<{ valid: boolean }>);
