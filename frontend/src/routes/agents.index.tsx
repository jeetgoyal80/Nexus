import { createFileRoute } from "@tanstack/react-router";
import { AgentsPage } from "@/features/agents/pages/agents-page";

export const Route = createFileRoute("/agents/")({
  head: () => ({ meta: [{ title: "Agents - Nexus" }] }),
  component: AgentsPage,
});
