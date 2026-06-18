export type ChatBotMode = "widget" | "embedded" | "fullscreen";
export type ChatBotThemeMode = "light" | "dark" | "system";
export type LauncherPosition = "bottom-right" | "bottom-left";

export type ChatBotTheme = {
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  borderRadius?: number;
  fontFamily?: string;
  launcherPosition?: LauncherPosition;
  widgetWidth?: number;
  widgetHeight?: number;
};

export type ChatBotProps = {
  botId: string;
  publicKey: string;
  mode?: ChatBotMode;
  apiBaseUrl?: string;
  className?: string;
  theme?: ChatBotThemeMode | ChatBotTheme;
  width?: number;
  height?: number;
  borderRadius?: number;
  primaryColor?: string;
  launcherPosition?: LauncherPosition;
  launcherOffset?: {
    x?: number;
    y?: number;
  };
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
    fontSize?: number;
    lineHeight?: number;
    messageSpacing?: number;
    headerTitle?: string;
    headerSubtitle?: string;
    headerBackgroundColor?: string;
    headerTextColor?: string;
    statusText?: string;
    welcomeTitle?: string;
    welcomeMessage?: string;
    greetingDescription?: string;
    starterPrompts?: string[];
    inputPlaceholder?: string;
    sendButtonColor?: string;
    botBubbleRadius?: number;
    userBubbleRadius?: number;
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
