import type { AppearanceConfig } from "@/features/agents/appearance/appearance.types";

export type PublicBot = {
  id: string;
  name: string;
  description: string;
  theme: string;
  welcomeMessage: string;
  avatar: string;
  visibility: "public";
  appearanceConfig: AppearanceConfig;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export type ChatResponse = {
  conversationId: string;
  sessionId: string | null;
  response: string;
  provider?: string;
  model?: string;
  sources?: unknown[];
  usage?: Record<string, unknown>;
};
