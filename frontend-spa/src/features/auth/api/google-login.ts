import { apiClient, unwrapApiData } from "@/shared/lib/axios";
import type { AuthSession } from "../types/auth.types";

export const googleLogin = (idToken: string) =>
  apiClient.post("/auth/google", { idToken }).then(unwrapApiData<AuthSession>);
