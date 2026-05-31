import { publicApiClient, unwrapApiData } from "@/shared/lib/axios";
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

export const sendPublicChatMessage = ({
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
  publicApiClient
    .post(`/chat/${botId}`, buildChatPayload({ message, conversationId, sessionId }))
    .then(unwrapApiData<ChatResponse>);
