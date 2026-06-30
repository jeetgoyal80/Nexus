import { useEffect, useState } from "react";
import { Link } from "@/shared/router/react-router-compat";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { ChatLayout } from "@/layouts/chat-layout";
import { ChatAppearancePreview } from "@/features/agents/appearance/chat-appearance-preview";
import { mergeAppearanceConfig } from "@/features/agents/appearance/appearance-config";
import { getApiErrorMessage } from "@/shared/lib/api-error";
import { usePublicBot, useSendPublicChatMessage } from "../hooks/use-chat-runtime";
import type { ChatMessage } from "../types/chat.types";

export function PublicChatPage({ botId }: { botId: string }) {
  const bot = usePublicBot(botId);
  const sendMessage = useSendPublicChatMessage();
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<string>();
  const [sessionId, setSessionId] = useState<string>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const appearanceConfig = mergeAppearanceConfig(bot.data?.appearanceConfig);

  useEffect(() => {
    if (!bot.data || messages.length) return;
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content:
          appearanceConfig.welcomeMessage ||
          bot.data.welcomeMessage ||
          `Hi, I'm ${bot.data.name}. Ask me anything.`,
      },
    ]);
  }, [appearanceConfig.welcomeMessage, bot.data, messages.length]);

  const send = async () => {
    if (!input.trim() || sendMessage.isPending || bot.isError) return;
    const content = input.trim();
    setInput("");
    setMessages((state) => [...state, { id: crypto.randomUUID(), role: "user", content }]);

    try {
      const result = await sendMessage.mutateAsync({
        botId,
        message: content,
        conversationId,
        sessionId,
      });
      setConversationId(result.conversationId);
      setSessionId(result.sessionId ?? undefined);
      setMessages((state) => [
        ...state,
        { id: crypto.randomUUID(), role: "assistant", content: result.response },
      ]);
    } catch (error) {
      setMessages((state) => [
        ...state,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: getApiErrorMessage(error, "The chat runtime is unavailable."),
        },
      ]);
    }
  };

  if (appearanceConfig.deploymentMode === "fullscreen") {
    return (
      <ChatLayout>
        <div className="h-screen" style={{ background: appearanceConfig.backgroundColor }}>
          {bot.isError ? (
            <div className="mx-auto max-w-3xl p-4">
              <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
                {getApiErrorMessage(
                  bot.error,
                  "This public bot is unavailable. Make sure the bot is public and the backend is running.",
                )}
              </div>
            </div>
          ) : (
            <ChatAppearancePreview
              appearanceConfig={appearanceConfig}
              botName={bot.data?.name ?? botId}
              messages={messages.map((message) => ({
                role: message.role,
                content: message.content,
              }))}
              variant="assistant"
              interactive
              input={input}
              onInputChange={setInput}
              onSend={send}
              disabled={sendMessage.isPending || bot.isLoading}
            />
          )}
        </div>
      </ChatLayout>
    );
  }

  return (
    <ChatLayout>
      <div className="min-h-screen px-4 py-4" style={{ background: "#0B1020" }}>
        <header className="mx-auto mb-4 flex h-11 max-w-5xl items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white/80 backdrop-blur transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <Logo />
        </header>

        <main className="mx-auto flex max-w-5xl justify-center">
          <div
            className={
              appearanceConfig.deploymentMode === "floating-widget"
                ? "w-full max-w-md"
                : "h-[calc(100vh-6rem)] w-full max-w-3xl"
            }
          >
            {bot.isError ? (
              <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
                {getApiErrorMessage(
                  bot.error,
                  "This public bot is unavailable. Make sure the bot is public and the backend is running.",
                )}
              </div>
            ) : (
              <ChatAppearancePreview
                appearanceConfig={appearanceConfig}
                botName={bot.data?.name ?? botId}
                messages={messages.map((message) => ({
                  role: message.role,
                  content: message.content,
                }))}
                variant="window"
                interactive
                input={input}
                onInputChange={setInput}
                onSend={send}
                disabled={sendMessage.isPending || bot.isLoading}
              />
            )}
          </div>
        </main>
      </div>
    </ChatLayout>
  );
}
