import { apiClient, unwrapApiData } from "@/shared/lib/axios";
import type { Agent } from "../types/agent.types";

export const deployAgent = (agentId: string) =>
  apiClient.post(`/bots/${agentId}/deploy`).then(unwrapApiData<{ bot: Agent }>);

export const unpublishAgent = (agentId: string) =>
  apiClient.post(`/bots/${agentId}/unpublish`).then(unwrapApiData<{ bot: Agent }>);
