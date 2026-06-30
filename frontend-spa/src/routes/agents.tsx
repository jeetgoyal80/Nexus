import { createFileRoute, Outlet } from "@/shared/router/react-router-compat";
import { requireAuth } from "@/features/auth/services/route-guards";

export const Route = createFileRoute("/agents")({
  beforeLoad: requireAuth,
  component: Outlet,
});
