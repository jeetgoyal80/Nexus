import { apiClient, unwrapApiData } from "@/shared/lib/axios";
import type { AuthSession, SignupPayload } from "../types/auth.types";

export const signup = (payload: SignupPayload) =>
  apiClient.post("/auth/signup", payload).then(unwrapApiData<AuthSession>);
