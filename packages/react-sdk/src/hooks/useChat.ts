import { useMemo, useState } from "react";
import { DEFAULT_API_BASE_URL, sendPublicMessage } from "../services/api";
import type { ChatBotMode, ChatMessage } from "../types";

export function useChat({
  botId,
  publicKey,
  apiBaseUrl = DEFAULT_API_BASE_URL,
  mode = "embedded",
  initialMessage,
}: {
  botId: string;
  publicKey: string;
  apiBaseUrl?: string;
  mode?: ChatBotMode;
  initialMessage?: string;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>(
    initialMessage ? [{ role: "assistant", content: initialMessage }] : [],
  );
  const [conversationId, setConversationId] = useState<string>();
  const [sessionId, setSessionId] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const channel = useMemo(() => (mode === "widget" ? "widget" : "react_sdk"), [mode]);

  const sendMessage = async (message: string) => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || loading) {
      return null;
    }

    setLoading(true);
    setError(null);
    setMessages((state) => [...state, { role: "user", content: trimmedMessage }]);

    try {
      const response = await sendPublicMessage({
        apiBaseUrl,
        botId,
        publicKey,
        message: trimmedMessage,
        conversationId,
        sessionId,
        channel,
      });

      setConversationId(response.conversationId);
      setSessionId(response.sessionId);
      setMessages((state) => [...state, { role: "assistant", content: response.response }]);
      return response;
    } catch (err) {
      const nextError = err instanceof Error ? err : new Error("Nexus chat request failed");
      setError(nextError);
      setMessages((state) => [...state, { role: "assistant", content: nextError.message }]);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    messages,
    sendMessage,
    loading,
    error,
    conversationId,
    sessionId,
  };
}
