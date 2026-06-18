export const BOT_VISIBILITY = {
  PRIVATE: "private",
  PUBLIC: "public",
};

export const BOT_DEPLOYMENT_STATUS = {
  DRAFT: "draft",
  DEPLOYED: "deployed",
};

export const BOT_DEPLOYMENT_MODE = {
  WIDGET: "widget",
  EMBEDDED: "embedded",
  FULLSCREEN: "fullscreen",
};

export const BOT_OUTPUT_FORMAT = {
  PARAGRAPH: "paragraph",
  BULLET_POINTS: "bullet_points",
  STRUCTURED_JSON: "structured_json",
};

export const BOT_TONE = {
  PROFESSIONAL: "professional",
  FRIENDLY: "friendly",
  CASUAL: "casual",
  CONCISE: "concise",
  TECHNICAL: "technical",
};

export const DEFAULT_APPEARANCE_CONFIG = {
  deploymentMode: "fullscreen",
  theme: "openai",
  primaryColor: "#10A37F",
  secondaryColor: "#F7F7F8",
  backgroundColor: "#FFFFFF",
  messageBubbleColor: "#F7F7F8",
  userBubbleColor: "#10A37F",
  userTextColor: "#FFFFFF",
  botBubbleColor: "#F7F7F8",
  botTextColor: "#202123",
  borderColor: "#E5E5E5",
  accentColor: "#10A37F",
  fontFamily: "Inter",
  fontSize: 14,
  messageSpacing: 16,
  lineHeight: 1.62,
  avatarUrl: "",
  avatarIcon: "sparkles",
  avatarShape: "circle",
  headerTitle: "",
  headerSubtitle: "AI assistant",
  statusText: "Online",
  showOnlineIndicator: true,
  headerBackgroundColor: "#FFFFFF",
  headerTextColor: "#202123",
  welcomeTitle: "How can I help?",
  welcomeMessage: "Hi! How can I help you today?",
  greetingDescription: "Ask a question and I will respond using the configured runtime and knowledge.",
  starterPrompts: ["What can you help with?", "Summarize the policy", "Show key details"],
  borderRadius: 18,
  windowShadow: "premium",
  borderThickness: 1,
  glassEffect: false,
  density: "comfortable",
  botBubbleRadius: 18,
  userBubbleRadius: 18,
  inputPlaceholder: "Message the assistant...",
  inputStyle: "soft",
  sendButtonStyle: "filled",
  sendButtonColor: "#10A37F",
  layoutType: "modern-assistant",
  widgetPosition: "bottom-right",
  widgetSize: "medium",
  widgetIcon: "message-circle",
  widgetColor: "#10A37F",
  widgetConfig: {
    position: "bottom-right",
    size: "medium",
    icon: "message-circle",
    color: "#10A37F",
  },
  embeddedConfig: {
    width: 720,
    height: 640,
    layout: "modern-assistant",
  },
  companyName: "",
  logoUrl: "",
  customBranding: false,
  showPoweredBy: true,
};
