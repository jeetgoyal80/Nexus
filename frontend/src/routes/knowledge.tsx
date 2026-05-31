import { createFileRoute } from "@tanstack/react-router";
import { KnowledgePage } from "@/features/knowledge/pages/knowledge-page";
import { requireAuth } from "@/features/auth/services/route-guards";

export const Route = createFileRoute("/knowledge")({
  beforeLoad: requireAuth,
  head: () => ({ meta: [{ title: "Knowledge Base - Nexus" }] }),
  component: KnowledgePage,
});
