import { redirect } from "@tanstack/react-router";
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
