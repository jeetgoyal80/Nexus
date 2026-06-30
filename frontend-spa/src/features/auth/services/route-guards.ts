import { redirect } from "@/shared/router/react-router-compat";
import { tokenStorage } from "./token-storage";

export function requireAuth() {
  if (typeof window === "undefined") return;

  if (!tokenStorage.getAccessToken()) {
    throw redirect({ to: "/login" });
  }
}

export function redirectAuthenticated() {
  if (typeof window === "undefined") return;

  if (tokenStorage.getAccessToken()) {
    throw redirect({ to: "/dashboard" });
  }
}
