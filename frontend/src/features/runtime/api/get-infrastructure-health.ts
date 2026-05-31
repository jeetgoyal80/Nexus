import { apiClient } from "@/shared/lib/axios";

export type InfrastructureHealth = {
  success: boolean;
  redis?: { status?: string; latencyMs?: number };
  queues?: {
    ingestion?: {
      waiting: number;
      active: number;
      completed: number;
      failed: number;
      delayed: number;
    };
  };
};

export const getInfrastructureHealth = () =>
  apiClient.get<InfrastructureHealth>("/health/infrastructure").then((response) => response.data);
