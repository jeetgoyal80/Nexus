import { apiClient, unwrapApiData } from "@/shared/lib/axios";
import type { ChatResponse } from "../types/chat.types";

const buildChatPayload = ({
  message,
  conversationId,
  sessionId,
}: {
  message: string;
  conversationId?: string | null;
  sessionId?: string | null;
}) => ({
  message,
  ...(conversationId ? { conversationId } : {}),
  ...(sessionId ? { sessionId } : {}),
});

export const sendChatMessage = ({
  botId,
  message,
  conversationId,
  sessionId,
}: {
  botId: string;
  message: string;
  conversationId?: string | null;
  sessionId?: string | null;
}) =>
  apiClient
    .post(`/chat/${botId}`, buildChatPayload({ message, conversationId, sessionId }))
    .then(unwrapApiData<ChatResponse>);
