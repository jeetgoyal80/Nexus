import { apiClient, unwrapApiData } from "@/shared/lib/axios";
import type { Agent, UpdateAgentPayload } from "../types/agent.types";

export const updateAgent = ({
  agentId,
  payload,
}: {
  agentId: string;
  payload: UpdateAgentPayload;
}) => apiClient.put(`/bots/${agentId}`, payload).then(unwrapApiData<{ bot: Agent }>);
