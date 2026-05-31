import { createFileRoute } from "@tanstack/react-router";
import { DashboardPage } from "@/features/analytics/pages/dashboard-page";
import { requireAuth } from "@/features/auth/services/route-guards";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: requireAuth,
  head: () => ({ meta: [{ title: "Dashboard - Nexus" }] }),
  component: DashboardPage,
});
