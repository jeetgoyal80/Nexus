import { apiClient, unwrapApiData } from "@/shared/lib/axios";
import type { Agent } from "../types/agent.types";

export const deployAgent = (agentId: string) =>
  apiClient.post(`/bots/${agentId}/deploy`).then(unwrapApiData<{ bot: Agent }>);

export const unpublishAgent = (agentId: string) =>
  apiClient.post(`/bots/${agentId}/unpublish`).then(unwrapApiData<{ bot: Agent }>);

export const regenerateAgentPublicKey = (agentId: string) =>
  apiClient.post(`/bots/${agentId}/regenerate-public-key`).then(unwrapApiData<{ bot: Agent }>);

export const updateAgentDeploymentAccess = ({
  agentId,
  payload,
}: {
  agentId: string;
  payload: Partial<Pick<Agent, "sdkEnabled" | "apiEnabled" | "deploymentMode">>;
}) =>
  apiClient
    .patch(`/bots/${agentId}/deployment-access`, payload)
    .then(unwrapApiData<{ bot: Agent }>);
