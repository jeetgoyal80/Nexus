import { apiClient, unwrapApiData } from "@/shared/lib/axios";
import type { Agent, CreateAgentPayload } from "../types/agent.types";

export const createAgent = (payload: CreateAgentPayload) =>
  apiClient.post("/bots", payload).then(unwrapApiData<{ bot: Agent }>);
