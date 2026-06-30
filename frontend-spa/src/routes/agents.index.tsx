import { createFileRoute } from "@/shared/router/react-router-compat";
import { AgentsPage } from "@/features/agents/pages/agents-page";

export const Route = createFileRoute("/agents/")({
  head: () => ({ meta: [{ title: "Agents - Nexus" }] }),
  component: AgentsPage,
});
