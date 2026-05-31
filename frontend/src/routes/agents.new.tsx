import { createFileRoute } from "@tanstack/react-router";
import { CreateAgentPage } from "@/features/agents/pages/create-agent-page";
import { requireAuth } from "@/features/auth/services/route-guards";

export const Route = createFileRoute("/agents/new")({
  beforeLoad: requireAuth,
  head: () => ({ meta: [{ title: "New Agent - Nexus" }] }),
  component: CreateAgentPage,
});
