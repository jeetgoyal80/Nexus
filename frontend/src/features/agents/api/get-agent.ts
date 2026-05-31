import { apiClient, unwrapApiData } from "@/shared/lib/axios";
import type { Agent } from "../types/agent.types";

export const getAgent = (agentId: string) =>
  apiClient.get(`/bots/${agentId}`).then(unwrapApiData<{ bot: Agent }>);
