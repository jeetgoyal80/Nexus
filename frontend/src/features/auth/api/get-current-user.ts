import { apiClient, unwrapApiData } from "@/shared/lib/axios";
import type { User } from "../types/auth.types";

export const getCurrentUser = () => apiClient.get("/auth/me").then(unwrapApiData<{ user: User }>);
