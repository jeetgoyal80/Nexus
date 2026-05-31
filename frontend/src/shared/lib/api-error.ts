import { AxiosError } from "axios";
import type { ApiErrorPayload } from "@/shared/types/api";

export function getApiErrorMessage(error: unknown, fallback = "Request failed") {
  if (error instanceof AxiosError) {
    const payload = error.response?.data as ApiErrorPayload | undefined;
    return payload?.message ?? error.message ?? fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}
