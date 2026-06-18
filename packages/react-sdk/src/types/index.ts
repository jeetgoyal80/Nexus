export type ChatBotMode = "widget" | "embedded" | "fullscreen";

export type ChatBotProps = {
  botId: string;
  publicKey: string;
  mode?: ChatBotMode;
  apiBaseUrl?: string;
  className?: string;
};

export type BotConfig = {
  botId: string;
  name: string;
  deploymentMode: "widget" | "embedded" | "fullscreen";
  avatarUrl?: string;
  publicKey?: string;
  appearanceConfig: {
    deploymentMode?: string;
    primaryColor?: string;
    secondaryColor?: string;
    backgroundColor?: string;
    botTextColor?: string;
    userTextColor?: string;
    userBubbleColor?: string;
    botBubbleColor?: string;
    borderColor?: string;
    accentColor?: string;
    fontFamily?: string;
    welcomeTitle?: string;
    welcomeMessage?: string;
    greetingDescription?: string;
    starterPrompts?: string[];
    inputPlaceholder?: string;
    widgetConfig?: {
      position?: "bottom-left" | "bottom-right";
      size?: "small" | "medium" | "large";
      color?: string;
    };
    embeddedConfig?: {
      width?: number;
      height?: number;
    };
  };
};

export type ChatMessage = {
  role: "assistant" | "user";
  content: string;
};

export type PublicChatResponse = {
  response: string;
  conversationId: string;
  sessionId?: string;
  sources?: unknown[];
};
