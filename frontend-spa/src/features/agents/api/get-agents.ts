import { apiClient, unwrapApiData } from "@/shared/lib/axios";
import type { Agent } from "../types/agent.types";

export const getAgents = () => apiClient.get("/bots").then(unwrapApiData<{ bots: Agent[] }>);
