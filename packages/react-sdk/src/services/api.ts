import type { BotConfig, PublicChatResponse } from "../types";

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
}: {
  apiBaseUrl: string;
  botId: string;
  publicKey: string;
  message: string;
  conversationId?: string;
  sessionId?: string;
}) =>
  request<PublicChatResponse>(`${apiBaseUrl}/public/chat`, {
    method: "POST",
    body: JSON.stringify({
      botId,
      publicKey,
      message,
      conversationId,
      sessionId,
    }),
  });
