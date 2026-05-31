import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { env } from "./env";
import type { ApiEnvelope, ApiErrorPayload } from "@/shared/types/api";
import { tokenStorage } from "@/features/auth/services/token-storage";

type RetryableRequest = InternalAxiosRequestConfig & { _retry?: boolean };
type RefreshResponse = ApiEnvelope<{ accessToken: string; user: unknown }>;

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  withCredentials: true,
  timeout: 20000,
});

export const publicApiClient = axios.create({
  baseURL: env.apiBaseUrl,
  withCredentials: true,
  timeout: 20000,
});

let accessToken: string | null = tokenStorage.getAccessToken();
let refreshPromise: Promise<string> | null = null;

export const setApiAccessToken = (token: string | null) => {
  accessToken = token;
  if (token) tokenStorage.setAccessToken(token);
  else tokenStorage.clearAccessToken();
};

const refreshAccessToken = async () => {
  if (!refreshPromise) {
    refreshPromise = apiClient
      .post<RefreshResponse>("/auth/refresh")
      .then((response) => {
        const nextToken = response.data.data.accessToken;
        setApiAccessToken(nextToken);
        return nextToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

apiClient.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorPayload>) => {
    const originalRequest = error.config as RetryableRequest | undefined;
    const status = error.response?.status;

    if (
      status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;
      try {
        const token = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        setApiAccessToken(null);
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("nexus:auth-expired"));
        }
        return Promise.reject(refreshError);
      }
    }

    if (status === 429 || (status && status >= 500)) {
      const retryCount = Number(originalRequest?.headers?.["x-nexus-retry"] ?? 0);
      if (originalRequest && retryCount < 2) {
        originalRequest.headers["x-nexus-retry"] = String(retryCount + 1);
        await new Promise((resolve) => setTimeout(resolve, 400 * (retryCount + 1)));
        return apiClient(originalRequest);
      }
    }

    return Promise.reject(error);
  },
);

export const unwrapApiData = <T>(response: { data: ApiEnvelope<T> }) => response.data.data;
