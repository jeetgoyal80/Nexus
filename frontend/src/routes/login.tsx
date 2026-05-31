import { createFileRoute } from "@tanstack/react-router";
import { LoginPage } from "@/features/auth/pages/login-page";
import { redirectAuthenticated } from "@/features/auth/services/route-guards";

export const Route = createFileRoute("/login")({
  beforeLoad: redirectAuthenticated,
  head: () => ({ meta: [{ title: "Login - Nexus" }] }),
  component: LoginPage,
});
