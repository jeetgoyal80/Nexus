import type { BotConfig, ChatBotMode, PublicChatResponse } from "../types";

export const DEFAULT_API_BASE_URL = "http://localhost:5000/api";

type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

const request = async <T>(url: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const payload = (await response.json()) as ApiEnvelope<T>;

  if (!response.ok || !payload.success) {
    throw new Error(payload.message || "Nexus SDK request failed");
  }

  return payload.data;
};

export const fetchBotConfig = ({ apiBaseUrl, botId }: { apiBaseUrl: string; botId: string }) =>
  request<BotConfig>(`${apiBaseUrl}/public/bots/${botId}/config`);

export const sendPublicMessage = ({
  apiBaseUrl,
  botId,
  publicKey,
  message,
  conversationId,
  sessionId,
  channel,
}: {
  apiBaseUrl: string;
  botId: string;
  publicKey: string;
  message: string;
  conversationId?: string;
  sessionId?: string;
  channel?: "public_api" | "react_sdk" | "widget";
}) =>
  request<PublicChatResponse>(`${apiBaseUrl}/public/chat`, {
    method: "POST",
    body: JSON.stringify({
      botId,
      publicKey,
      message,
      conversationId,
      sessionId,
      channel,
    }),
  });

export const createNexusClient = ({
  botId,
  publicKey,
  apiBaseUrl = DEFAULT_API_BASE_URL,
}: {
  botId: string;
  publicKey: string;
  apiBaseUrl?: string;
}) => ({
  getConfig: () => fetchBotConfig({ apiBaseUrl, botId }),
  chat: (message: string, options?: { conversationId?: string; sessionId?: string; mode?: ChatBotMode }) =>
    sendPublicMessage({
      apiBaseUrl,
      botId,
      publicKey,
      message,
      conversationId: options?.conversationId,
      sessionId: options?.sessionId,
      channel: options?.mode === "widget" ? "widget" : "react_sdk",
    }),
});
