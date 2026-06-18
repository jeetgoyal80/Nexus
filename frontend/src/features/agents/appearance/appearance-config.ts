import type { AppearanceConfig } from "./appearance.types";

type ThemeSurface = "light" | "dark";

type ThemePreset = {
  id: string;
  name: string;
  description: string;
  surface: ThemeSurface;
  config: Partial<AppearanceConfig>;
};

type RGB = { r: number; g: number; b: number };

export const defaultAppearanceConfig: AppearanceConfig = {
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

export const themePresets: ThemePreset[] = [
  {
    id: "openai",
    name: "OpenAI",
    description: "Clean white canvas with restrained green brand energy.",
    surface: "light",
    config: {
      primaryColor: "#10A37F",
      backgroundColor: "#FFFFFF",
      secondaryColor: "#F7F7F8",
      headerBackgroundColor: "#FFFFFF",
      botBubbleColor: "#F7F7F8",
      fontFamily: "Inter",
      windowShadow: "soft",
    },
  },
  {
    id: "claude",
    name: "Claude",
    description: "Warm, editorial, and calm for knowledge-heavy assistants.",
    surface: "light",
    config: {
      primaryColor: "#C15F3C",
      backgroundColor: "#FAF7F2",
      secondaryColor: "#F1ECE4",
      headerBackgroundColor: "#FAF7F2",
      botBubbleColor: "#FFFFFF",
      fontFamily: "Inter",
      windowShadow: "soft",
    },
  },
  {
    id: "linear",
    name: "Linear",
    description: "Precise dark product UI with cool blue accents.",
    surface: "dark",
    config: {
      primaryColor: "#5E6AD2",
      backgroundColor: "#0D0E12",
      secondaryColor: "#17181F",
      headerBackgroundColor: "#111217",
      botBubbleColor: "#17181F",
      fontFamily: "Inter",
      windowShadow: "premium",
    },
  },
  {
    id: "vercel",
    name: "Vercel",
    description: "Sharp monochrome interface with high signal clarity.",
    surface: "dark",
    config: {
      primaryColor: "#FFFFFF",
      backgroundColor: "#000000",
      secondaryColor: "#111111",
      headerBackgroundColor: "#050505",
      botBubbleColor: "#111111",
      fontFamily: "Geist",
      windowShadow: "premium",
    },
  },
  {
    id: "notion",
    name: "Notion",
    description: "Document-like workspace with subtle neutral hierarchy.",
    surface: "light",
    config: {
      primaryColor: "#2F3437",
      backgroundColor: "#FFFFFF",
      secondaryColor: "#F7F6F3",
      headerBackgroundColor: "#FFFFFF",
      botBubbleColor: "#F7F6F3",
      fontFamily: "Inter",
      windowShadow: "soft",
    },
  },
  {
    id: "corporate",
    name: "Corporate",
    description: "Reliable enterprise blue with accessible contrast.",
    surface: "light",
    config: {
      primaryColor: "#1D4ED8",
      backgroundColor: "#F8FAFC",
      secondaryColor: "#FFFFFF",
      headerBackgroundColor: "#FFFFFF",
      botBubbleColor: "#FFFFFF",
      fontFamily: "Inter",
      windowShadow: "premium",
    },
  },
  {
    id: "modern-dark",
    name: "Modern Dark",
    description: "Premium dark SaaS runtime with polished depth.",
    surface: "dark",
    config: {
      primaryColor: "#7C3AED",
      backgroundColor: "#0F172A",
      secondaryColor: "#111827",
      headerBackgroundColor: "#111827",
      botBubbleColor: "#1E293B",
      fontFamily: "Inter",
      windowShadow: "dramatic",
    },
  },
  {
    id: "elegant-light",
    name: "Elegant Light",
    description: "Refined editorial palette for premium support bots.",
    surface: "light",
    config: {
      primaryColor: "#9F1239",
      backgroundColor: "#FFFBFA",
      secondaryColor: "#FFF1F2",
      headerBackgroundColor: "#FFFBFA",
      botBubbleColor: "#FFFFFF",
      fontFamily: "Poppins",
      windowShadow: "soft",
    },
  },
];

const clamp = (value: number) => Math.min(255, Math.max(0, Math.round(value)));

const normalizeHex = (hex: string | undefined, fallback: string) =>
  /^#[0-9A-Fa-f]{6}$/.test(hex ?? "") ? hex! : fallback;

const hexToRgb = (hex: string): RGB => ({
  r: parseInt(hex.slice(1, 3), 16),
  g: parseInt(hex.slice(3, 5), 16),
  b: parseInt(hex.slice(5, 7), 16),
});

const rgbToHex = ({ r, g, b }: RGB) =>
  `#${[r, g, b].map((value) => clamp(value).toString(16).padStart(2, "0")).join("")}`;

const mix = (from: string, to: string, amount: number) => {
  const a = hexToRgb(from);
  const b = hexToRgb(to);
  return rgbToHex({
    r: a.r + (b.r - a.r) * amount,
    g: a.g + (b.g - a.g) * amount,
    b: a.b + (b.b - a.b) * amount,
  });
};

const luminance = (hex: string) => {
  const { r, g, b } = hexToRgb(hex);
  const values = [r, g, b].map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : Math.pow((normalized + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * values[0] + 0.7152 * values[1] + 0.0722 * values[2];
};

export const contrastRatio = (foreground: string, background: string) => {
  const lighter = Math.max(luminance(foreground), luminance(background));
  const darker = Math.min(luminance(foreground), luminance(background));
  return (lighter + 0.05) / (darker + 0.05);
};

const readableText = (background: string, minimum = 4.5) => {
  const dark = "#111827";
  const light = "#FFFFFF";

  if (contrastRatio(dark, background) >= minimum) return dark;
  if (contrastRatio(light, background) >= minimum) return light;

  return contrastRatio(dark, background) > contrastRatio(light, background) ? dark : light;
};

const ensureContrast = (foreground: string, background: string, fallback: string, minimum = 4.5) =>
  contrastRatio(foreground, background) >= minimum ? foreground : fallback;

const isDarkSurface = (background: string) => luminance(background) < 0.35;

export const getThemePreset = (themeId?: string) =>
  themePresets.find((theme) => theme.id === themeId) ?? themePresets[0];

export const resolveSmartAppearanceConfig = (
  config?: Partial<AppearanceConfig> | null,
): AppearanceConfig => {
  const merged = {
    ...defaultAppearanceConfig,
    ...(config ?? {}),
  };
  const preset = getThemePreset(merged.theme);
  const base = {
    ...defaultAppearanceConfig,
    ...preset.config,
    ...(config ?? {}),
    theme: preset.id,
  };

  const backgroundColor = normalizeHex(base.backgroundColor, defaultAppearanceConfig.backgroundColor);
  const primaryColor = normalizeHex(base.primaryColor, defaultAppearanceConfig.primaryColor);
  const dark = isDarkSurface(backgroundColor);
  const panelColor = normalizeHex(
    base.secondaryColor,
    dark ? mix(backgroundColor, "#FFFFFF", 0.08) : mix(backgroundColor, "#000000", 0.035),
  );
  const botBubbleColor = normalizeHex(
    base.botBubbleColor,
    dark ? mix(backgroundColor, "#FFFFFF", 0.08) : "#F7F7F8",
  );
  const userBubbleColor = primaryColor;
  const botTextColor = ensureContrast(
    base.botTextColor,
    botBubbleColor,
    readableText(botBubbleColor),
  );
  const userTextColor = readableText(userBubbleColor);
  const backgroundTextColor = readableText(backgroundColor);
  const safeBotTextColor = ensureContrast(botTextColor, botBubbleColor, backgroundTextColor);
  const headerBackgroundColor = normalizeHex(base.headerBackgroundColor, panelColor);
  const headerTextColor = readableText(headerBackgroundColor);
  const borderColor = normalizeHex(
    base.borderColor,
    dark ? mix(backgroundColor, "#FFFFFF", 0.16) : mix(backgroundColor, "#000000", 0.12),
  );
  const accentColor = normalizeHex(
    base.accentColor,
    dark ? mix(primaryColor, "#FFFFFF", 0.2) : mix(primaryColor, "#000000", 0.12),
  );
  const widgetConfig = {
    position: base.widgetConfig?.position ?? base.widgetPosition ?? defaultAppearanceConfig.widgetConfig.position,
    size: base.widgetConfig?.size ?? base.widgetSize ?? defaultAppearanceConfig.widgetConfig.size,
    icon: base.widgetConfig?.icon ?? base.widgetIcon ?? defaultAppearanceConfig.widgetConfig.icon,
    color: normalizeHex(base.widgetConfig?.color ?? base.widgetColor, primaryColor),
  };
  const embeddedConfig = {
    width: Math.min(960, Math.max(320, base.embeddedConfig?.width ?? defaultAppearanceConfig.embeddedConfig.width)),
    height: Math.min(900, Math.max(420, base.embeddedConfig?.height ?? defaultAppearanceConfig.embeddedConfig.height)),
    layout: base.embeddedConfig?.layout ?? base.layoutType ?? defaultAppearanceConfig.embeddedConfig.layout,
  };

  return {
    ...base,
    deploymentMode: base.deploymentMode ?? "fullscreen",
    primaryColor,
    secondaryColor: panelColor,
    backgroundColor,
    messageBubbleColor: botBubbleColor,
    userBubbleColor,
    userTextColor,
    botBubbleColor,
    botTextColor: safeBotTextColor,
    borderColor,
    accentColor,
    headerBackgroundColor,
    headerTextColor,
    sendButtonColor: primaryColor,
    widgetColor: primaryColor,
    widgetPosition: widgetConfig.position,
    widgetSize: widgetConfig.size,
    widgetIcon: widgetConfig.icon,
    widgetConfig,
    embeddedConfig,
    layoutType: embeddedConfig.layout,
    fontSize: Math.min(16, Math.max(13, base.fontSize)),
    lineHeight: Math.min(1.8, Math.max(1.45, base.lineHeight)),
    messageSpacing: Math.min(22, Math.max(14, base.messageSpacing)),
    borderRadius: Math.min(24, Math.max(12, base.borderRadius)),
    botBubbleRadius: Math.min(22, Math.max(14, base.botBubbleRadius)),
    userBubbleRadius: Math.min(22, Math.max(14, base.userBubbleRadius)),
    starterPrompts: base.starterPrompts?.length
      ? base.starterPrompts.slice(0, 6)
      : defaultAppearanceConfig.starterPrompts,
    headerSubtitle: base.headerSubtitle || "AI assistant",
    statusText: base.statusText || "Online",
    welcomeTitle: base.welcomeTitle || "How can I help?",
    greetingDescription: base.greetingDescription || defaultAppearanceConfig.greetingDescription,
    inputPlaceholder: base.inputPlaceholder || defaultAppearanceConfig.inputPlaceholder,
  };
};

export const mergeAppearanceConfig = resolveSmartAppearanceConfig;

export const applyThemePreset = (
  current: AppearanceConfig,
  presetId: string,
): AppearanceConfig => resolveSmartAppearanceConfig({
  ...current,
  ...(getThemePreset(presetId).config ?? {}),
  theme: presetId,
});

export const updatePrimaryColor = (
  current: AppearanceConfig,
  primaryColor: string,
): AppearanceConfig =>
  resolveSmartAppearanceConfig({
    ...current,
    primaryColor,
  });
