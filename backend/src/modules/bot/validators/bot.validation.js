import { z } from "zod";
import ApiError from "../../../shared/utils/ApiError.js";
import { HTTP_STATUS } from "../../../shared/constants/httpStatus.js";
import {
  BOT_DEPLOYMENT_MODE,
  BOT_OUTPUT_FORMAT,
  BOT_TONE,
  BOT_VISIBILITY,
} from "../constants/bot.constants.js";

const hexColorSchema = z.string().trim().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a hex color");

const appearanceConfigSchema = z
  .object({
    deploymentMode: z.enum(["fullscreen", "floating-widget", "embedded"]).optional(),
    theme: z.string().trim().min(2).max(60).optional(),
    primaryColor: hexColorSchema.optional(),
    secondaryColor: hexColorSchema.optional(),
    backgroundColor: hexColorSchema.optional(),
    messageBubbleColor: hexColorSchema.optional(),
    userBubbleColor: hexColorSchema.optional(),
    userTextColor: hexColorSchema.optional(),
    botBubbleColor: hexColorSchema.optional(),
    botTextColor: hexColorSchema.optional(),
    borderColor: hexColorSchema.optional(),
    accentColor: hexColorSchema.optional(),
    fontFamily: z.enum(["Inter", "Geist", "Poppins", "Satoshi", "Roboto"]).optional(),
    fontSize: z.number().min(12).max(20).optional(),
    messageSpacing: z.number().min(6).max(28).optional(),
    lineHeight: z.number().min(1.2).max(2).optional(),
    avatarUrl: z.string().trim().max(500).optional(),
    avatarIcon: z.enum(["sparkles", "bot", "message-circle", "graduation-cap", "briefcase"]).optional(),
    avatarShape: z.enum(["circle", "rounded", "square"]).optional(),
    headerTitle: z.string().trim().max(80).optional(),
    headerSubtitle: z.string().trim().max(120).optional(),
    statusText: z.string().trim().max(120).optional(),
    showOnlineIndicator: z.boolean().optional(),
    headerBackgroundColor: hexColorSchema.optional(),
    headerTextColor: hexColorSchema.optional(),
    welcomeTitle: z.string().trim().max(100).optional(),
    welcomeMessage: z.string().trim().max(300).optional(),
    greetingDescription: z.string().trim().max(500).optional(),
    starterPrompts: z.array(z.string().trim().min(1).max(80)).max(6).optional(),
    borderRadius: z.number().min(0).max(32).optional(),
    windowShadow: z.enum(["none", "soft", "premium", "dramatic"]).optional(),
    borderThickness: z.number().min(0).max(4).optional(),
    glassEffect: z.boolean().optional(),
    density: z.enum(["compact", "comfortable", "spacious"]).optional(),
    botBubbleRadius: z.number().min(0).max(28).optional(),
    userBubbleRadius: z.number().min(0).max(28).optional(),
    inputPlaceholder: z.string().trim().max(100).optional(),
    inputStyle: z.enum(["soft", "outline", "filled"]).optional(),
    sendButtonStyle: z.enum(["filled", "soft", "minimal"]).optional(),
    sendButtonColor: hexColorSchema.optional(),
    layoutType: z
      .enum(["standard-chat", "modern-assistant", "minimal", "enterprise", "floating-widget"])
      .optional(),
    widgetPosition: z.enum(["bottom-right", "bottom-left"]).optional(),
    widgetSize: z.enum(["small", "medium", "large"]).optional(),
    widgetIcon: z.enum(["message-circle", "sparkles", "bot"]).optional(),
    widgetColor: hexColorSchema.optional(),
    widgetConfig: z
      .object({
        position: z.enum(["bottom-right", "bottom-left"]).optional(),
        size: z.enum(["small", "medium", "large"]).optional(),
        icon: z.enum(["message-circle", "sparkles", "bot"]).optional(),
        color: hexColorSchema.optional(),
      })
      .strict()
      .optional(),
    embeddedConfig: z
      .object({
        width: z.number().min(320).max(960).optional(),
        height: z.number().min(420).max(900).optional(),
        layout: z
          .enum(["standard-chat", "modern-assistant", "minimal", "enterprise", "floating-widget"])
          .optional(),
      })
      .strict()
      .optional(),
    companyName: z.string().trim().max(100).optional(),
    logoUrl: z.string().trim().max(500).optional(),
    customBranding: z.boolean().optional(),
    showPoweredBy: z.boolean().optional(),
  })
  .strict();

const instructionsSchema = z
  .union([
    z.string().trim().max(4000),
    z.array(z.string().trim().min(1).max(500)).max(20),
  ])
  .transform((value) => (Array.isArray(value) ? value.map((item) => `- ${item}`).join("\n") : value));

const createBotFields = {
  name: z.string().trim().min(2).max(80),
  description: z.string().trim().max(500).optional().default(""),
  role: z.string().trim().min(2).max(120),
  tone: z.enum(Object.values(BOT_TONE)).optional(),
  instructions: instructionsSchema.optional().default(""),
  strictKnowledgeMode: z.boolean().optional().default(false),
  outputFormat: z.enum(Object.values(BOT_OUTPUT_FORMAT)).optional(),
  theme: z.string().trim().min(2).max(40).optional(),
  welcomeMessage: z.string().trim().max(300).optional(),
  avatar: z.string().trim().max(500).optional(),
  visibility: z.enum(Object.values(BOT_VISIBILITY)).optional(),
  deploymentMode: z.enum(Object.values(BOT_DEPLOYMENT_MODE)).optional(),
  sdkEnabled: z.boolean().optional(),
  apiEnabled: z.boolean().optional(),
  appearanceConfig: appearanceConfigSchema.optional(),
  runtimeProvider: z.enum(["user", "platform"]).optional(),
  apiKey: z.string().trim().min(20).max(300).optional(),
  model: z.string().trim().min(2).max(120).optional(),
};

const updateBotFields = {
  name: z.string().trim().min(2).max(80).optional(),
  description: z.string().trim().max(500).optional(),
  role: z.string().trim().min(2).max(120).optional(),
  tone: z.enum(Object.values(BOT_TONE)).optional(),
  instructions: instructionsSchema.optional(),
  strictKnowledgeMode: z.boolean().optional(),
  outputFormat: z.enum(Object.values(BOT_OUTPUT_FORMAT)).optional(),
  theme: z.string().trim().min(2).max(40).optional(),
  welcomeMessage: z.string().trim().max(300).optional(),
  avatar: z.string().trim().max(500).optional(),
  visibility: z.enum(Object.values(BOT_VISIBILITY)).optional(),
  deploymentMode: z.enum(Object.values(BOT_DEPLOYMENT_MODE)).optional(),
  sdkEnabled: z.boolean().optional(),
  apiEnabled: z.boolean().optional(),
  appearanceConfig: appearanceConfigSchema.optional(),
  runtimeProvider: z.enum(["user", "platform"]).optional(),
  apiKey: z.string().trim().min(20).max(300).optional(),
  model: z.string().trim().min(2).max(120).optional(),
};

export const createBotSchema = z.object({
  body: z.object(createBotFields),
});

export const updateBotSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Bot id is required"),
  }),
  body: z
    .object(updateBotFields)
    .refine((payload) => Object.keys(payload).length > 0, {
      message: "At least one field is required for update",
    }),
});

export const botIdParamSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Bot id is required"),
  }),
});

export const deploymentAccessSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Bot id is required"),
  }),
  body: z
    .object({
      sdkEnabled: z.boolean().optional(),
      apiEnabled: z.boolean().optional(),
      deploymentMode: z.enum(Object.values(BOT_DEPLOYMENT_MODE)).optional(),
    })
    .refine((payload) => Object.keys(payload).length > 0, {
      message: "At least one deployment setting is required",
    }),
});

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query,
  });

  if (!result.success) {
    return next(
      new ApiError(
        HTTP_STATUS.UNPROCESSABLE_ENTITY,
        "Request validation failed",
        result.error.flatten().fieldErrors,
      ),
    );
  }

  req.validated = result.data;
  return next();
};
