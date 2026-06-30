import { createFileRoute } from "@/shared/router/react-router-compat";
import { SignupPage } from "@/features/auth/pages/signup-page";
import { redirectAuthenticated } from "@/features/auth/services/route-guards";

export const Route = createFileRoute("/signup")({
  beforeLoad: redirectAuthenticated,
  head: () => ({ meta: [{ title: "Signup - Nexus" }] }),
  component: SignupPage,
});
