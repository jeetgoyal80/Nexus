import { redirect } from "@tanstack/react-router";
import { tokenStorage } from "./token-storage";

export function requireAuth() {
  if (!tokenStorage.getAccessToken()) {
    throw redirect({ to: "/login" });
  }
}

export function redirectAuthenticated() {
  if (tokenStorage.getAccessToken()) {
    throw redirect({ to: "/dashboard" });
  }
}
