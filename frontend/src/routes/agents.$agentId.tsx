import { createFileRoute } from "@tanstack/react-router";
import { AgentBuilderPage } from "@/features/agents/pages/agent-builder-page";
import { requireAuth } from "@/features/auth/services/route-guards";

export const Route = createFileRoute("/agents/$agentId")({
  beforeLoad: requireAuth,
  head: () => ({ meta: [{ title: "Bot Builder - Nexus" }] }),
  component: BuilderRoute,
});

function BuilderRoute() {
  const { agentId } = Route.useParams();
  return <AgentBuilderPage agentId={agentId} />;
}
