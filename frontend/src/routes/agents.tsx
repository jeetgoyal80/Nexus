import { createFileRoute, Outlet } from "@tanstack/react-router";
import { requireAuth } from "@/features/auth/services/route-guards";

export const Route = createFileRoute("/agents")({
  beforeLoad: requireAuth,
  component: Outlet,
});
