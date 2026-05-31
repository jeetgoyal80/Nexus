import { apiClient, unwrapApiData } from "@/shared/lib/axios";
import type { AuthSession, LoginPayload } from "../types/auth.types";

export const login = (payload: LoginPayload) =>
  apiClient.post("/auth/login", payload).then(unwrapApiData<AuthSession>);
