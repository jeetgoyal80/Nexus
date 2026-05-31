import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/shared/Logo";
import { ChatLayout } from "@/layouts/chat-layout";
import { OperationalIndicator } from "@/shared/components/ui/operational-indicator";
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
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bot.data || messages.length) return;
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: bot.data.welcomeMessage || `Hi, I'm ${bot.data.name}. Ask me anything.`,
      },
    ]);
  }, [bot.data, messages.length]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sendMessage.isPending]);

  const send = async () => {
    if (!input.trim() || sendMessage.isPending) return;
    const content = input;
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

  return (
    <ChatLayout>
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b border-border/70 bg-background/80 px-4 backdrop-blur-xl">
          <Link
            to="/"
            className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-[color:var(--accent-blue)] to-[color:var(--accent-violet)] text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-medium">{bot.data?.name ?? botId}</p>
            <OperationalIndicator
              state={sendMessage.isPending ? "processing" : bot.isError ? "degraded" : "healthy"}
              label={
                sendMessage.isPending ? "reasoning" : bot.isError ? "offline" : "runtime online"
              }
            />
          </div>
          <div className="ml-auto">
            <Logo />
          </div>
        </header>

        <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4">
          <div className="scrollbar-thin flex-1 space-y-4 overflow-y-auto py-8">
            {bot.isError && (
              <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
                {getApiErrorMessage(
                  bot.error,
                  "This public bot is unavailable. Make sure the bot is public and the backend is running.",
                )}
              </div>
            )}
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} gap-2`}
              >
                {message.role === "assistant" && <Avatar />}
                <div
                  className={`max-w-[78%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${message.role === "user" ? "bg-primary text-primary-foreground" : "border border-border bg-card"}`}
                >
                  {message.content}
                </div>
              </motion.div>
            ))}
            {sendMessage.isPending && (
              <div className="flex items-center gap-2">
                <Avatar />
                <div className="rounded-2xl border border-border bg-card px-4 py-3">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((index) => (
                      <motion.span
                        key={index}
                        className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: index * 0.15 }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="sticky bottom-0 mb-4 rounded-2xl border border-border bg-card/90 p-2 backdrop-blur elevated">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && send()}
                placeholder={`Message ${bot.data?.name ?? botId}...`}
                className="border-0 bg-transparent text-sm focus-visible:ring-0"
              />
              <Button
                onClick={send}
                disabled={sendMessage.isPending || bot.isError}
                className="bg-gradient-to-r from-[color:var(--accent-blue)] to-[color:var(--accent-violet)] text-primary-foreground"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="px-3 pb-1 pt-1 text-[10px] text-muted-foreground">
              Responses are generated by the live Groq/RAG runtime. Verify important information.
            </p>
          </div>
        </main>
      </div>
    </ChatLayout>
  );
}

function Avatar() {
  return (
    <div className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[color:var(--accent-blue)] to-[color:var(--accent-violet)] text-primary-foreground">
      <Sparkles className="h-3.5 w-3.5" />
    </div>
  );
}
