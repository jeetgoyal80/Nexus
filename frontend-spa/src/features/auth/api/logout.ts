import { apiClient } from "@/shared/lib/axios";

export const logout = () => apiClient.post("/auth/logout");
