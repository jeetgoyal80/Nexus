export type PublicBot = {
  id: string;
  name: string;
  description: string;
  theme: string;
  welcomeMessage: string;
  avatar: string;
  visibility: "public";
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
