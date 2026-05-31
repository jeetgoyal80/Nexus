import { apiClient, unwrapApiData } from "@/shared/lib/axios";
import type { Agent } from "../types/agent.types";

export const deleteAgent = (agentId: string) =>
  apiClient.delete(`/bots/${agentId}`).then(unwrapApiData<{ bot: Agent }>);
