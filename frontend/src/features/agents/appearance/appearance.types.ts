export type AvatarShape = "circle" | "rounded" | "square";
export type ChatDensity = "compact" | "comfortable" | "spacious";
export type ChatLayoutType =
  | "standard-chat"
  | "modern-assistant"
  | "minimal"
  | "enterprise"
  | "floating-widget";
export type WidgetPosition = "bottom-right" | "bottom-left";
export type WidgetSize = "small" | "medium" | "large";
export type DeploymentMode = "fullscreen" | "floating-widget" | "embedded";

export type WidgetConfig = {
  position: WidgetPosition;
  size: WidgetSize;
  icon: "message-circle" | "sparkles" | "bot";
  color: string;
};

export type EmbeddedConfig = {
  width: number;
  height: number;
  layout: ChatLayoutType;
};

export type AppearanceConfig = {
  deploymentMode: DeploymentMode;
  theme: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  messageBubbleColor: string;
  userBubbleColor: string;
  userTextColor: string;
  botBubbleColor: string;
  botTextColor: string;
  borderColor: string;
  accentColor: string;
  fontFamily: "Inter" | "Geist" | "Poppins" | "Satoshi" | "Roboto";
  fontSize: number;
  messageSpacing: number;
  lineHeight: number;
  avatarUrl: string;
  avatarIcon: "sparkles" | "bot" | "message-circle" | "graduation-cap" | "briefcase";
  avatarShape: AvatarShape;
  headerTitle: string;
  headerSubtitle: string;
  statusText: string;
  showOnlineIndicator: boolean;
  headerBackgroundColor: string;
  headerTextColor: string;
  welcomeTitle: string;
  welcomeMessage: string;
  greetingDescription: string;
  starterPrompts: string[];
  borderRadius: number;
  windowShadow: "none" | "soft" | "premium" | "dramatic";
  borderThickness: number;
  glassEffect: boolean;
  density: ChatDensity;
  botBubbleRadius: number;
  userBubbleRadius: number;
  inputPlaceholder: string;
  inputStyle: "soft" | "outline" | "filled";
  sendButtonStyle: "filled" | "soft" | "minimal";
  sendButtonColor: string;
  layoutType: ChatLayoutType;
  widgetPosition: WidgetPosition;
  widgetSize: WidgetSize;
  widgetIcon: "message-circle" | "sparkles" | "bot";
  widgetColor: string;
  widgetConfig: WidgetConfig;
  embeddedConfig: EmbeddedConfig;
  companyName: string;
  logoUrl: string;
  customBranding: boolean;
  showPoweredBy: boolean;
};
