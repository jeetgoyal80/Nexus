import mongoose from "mongoose";
import {
  BOT_DEPLOYMENT_MODE,
  BOT_DEPLOYMENT_STATUS,
  BOT_OUTPUT_FORMAT,
  BOT_TONE,
  BOT_VISIBILITY,
  DEFAULT_APPEARANCE_CONFIG,
} from "../constants/bot.constants.js";

const appearanceConfigSchema = new mongoose.Schema(
  {
    deploymentMode: { type: String, default: DEFAULT_APPEARANCE_CONFIG.deploymentMode },
    theme: { type: String, default: DEFAULT_APPEARANCE_CONFIG.theme },
    primaryColor: { type: String, default: DEFAULT_APPEARANCE_CONFIG.primaryColor },
    secondaryColor: { type: String, default: DEFAULT_APPEARANCE_CONFIG.secondaryColor },
    backgroundColor: { type: String, default: DEFAULT_APPEARANCE_CONFIG.backgroundColor },
    messageBubbleColor: { type: String, default: DEFAULT_APPEARANCE_CONFIG.messageBubbleColor },
    userBubbleColor: { type: String, default: DEFAULT_APPEARANCE_CONFIG.userBubbleColor },
    userTextColor: { type: String, default: DEFAULT_APPEARANCE_CONFIG.userTextColor },
    botBubbleColor: { type: String, default: DEFAULT_APPEARANCE_CONFIG.botBubbleColor },
    botTextColor: { type: String, default: DEFAULT_APPEARANCE_CONFIG.botTextColor },
    borderColor: { type: String, default: DEFAULT_APPEARANCE_CONFIG.borderColor },
    accentColor: { type: String, default: DEFAULT_APPEARANCE_CONFIG.accentColor },
    fontFamily: { type: String, default: DEFAULT_APPEARANCE_CONFIG.fontFamily },
    fontSize: { type: Number, default: DEFAULT_APPEARANCE_CONFIG.fontSize },
    messageSpacing: { type: Number, default: DEFAULT_APPEARANCE_CONFIG.messageSpacing },
    lineHeight: { type: Number, default: DEFAULT_APPEARANCE_CONFIG.lineHeight },
    avatarUrl: { type: String, default: DEFAULT_APPEARANCE_CONFIG.avatarUrl },
    avatarIcon: { type: String, default: DEFAULT_APPEARANCE_CONFIG.avatarIcon },
    avatarShape: { type: String, default: DEFAULT_APPEARANCE_CONFIG.avatarShape },
    headerTitle: { type: String, default: DEFAULT_APPEARANCE_CONFIG.headerTitle },
    headerSubtitle: { type: String, default: DEFAULT_APPEARANCE_CONFIG.headerSubtitle },
    statusText: { type: String, default: DEFAULT_APPEARANCE_CONFIG.statusText },
    showOnlineIndicator: { type: Boolean, default: DEFAULT_APPEARANCE_CONFIG.showOnlineIndicator },
    headerBackgroundColor: {
      type: String,
      default: DEFAULT_APPEARANCE_CONFIG.headerBackgroundColor,
    },
    headerTextColor: { type: String, default: DEFAULT_APPEARANCE_CONFIG.headerTextColor },
    welcomeTitle: { type: String, default: DEFAULT_APPEARANCE_CONFIG.welcomeTitle },
    welcomeMessage: { type: String, default: DEFAULT_APPEARANCE_CONFIG.welcomeMessage },
    greetingDescription: { type: String, default: DEFAULT_APPEARANCE_CONFIG.greetingDescription },
    starterPrompts: { type: [String], default: DEFAULT_APPEARANCE_CONFIG.starterPrompts },
    borderRadius: { type: Number, default: DEFAULT_APPEARANCE_CONFIG.borderRadius },
    windowShadow: { type: String, default: DEFAULT_APPEARANCE_CONFIG.windowShadow },
    borderThickness: { type: Number, default: DEFAULT_APPEARANCE_CONFIG.borderThickness },
    glassEffect: { type: Boolean, default: DEFAULT_APPEARANCE_CONFIG.glassEffect },
    density: { type: String, default: DEFAULT_APPEARANCE_CONFIG.density },
    botBubbleRadius: { type: Number, default: DEFAULT_APPEARANCE_CONFIG.botBubbleRadius },
    userBubbleRadius: { type: Number, default: DEFAULT_APPEARANCE_CONFIG.userBubbleRadius },
    inputPlaceholder: { type: String, default: DEFAULT_APPEARANCE_CONFIG.inputPlaceholder },
    inputStyle: { type: String, default: DEFAULT_APPEARANCE_CONFIG.inputStyle },
    sendButtonStyle: { type: String, default: DEFAULT_APPEARANCE_CONFIG.sendButtonStyle },
    sendButtonColor: { type: String, default: DEFAULT_APPEARANCE_CONFIG.sendButtonColor },
    layoutType: { type: String, default: DEFAULT_APPEARANCE_CONFIG.layoutType },
    widgetPosition: { type: String, default: DEFAULT_APPEARANCE_CONFIG.widgetPosition },
    widgetSize: { type: String, default: DEFAULT_APPEARANCE_CONFIG.widgetSize },
    widgetIcon: { type: String, default: DEFAULT_APPEARANCE_CONFIG.widgetIcon },
    widgetColor: { type: String, default: DEFAULT_APPEARANCE_CONFIG.widgetColor },
    widgetConfig: {
      position: { type: String, default: DEFAULT_APPEARANCE_CONFIG.widgetConfig.position },
      size: { type: String, default: DEFAULT_APPEARANCE_CONFIG.widgetConfig.size },
      icon: { type: String, default: DEFAULT_APPEARANCE_CONFIG.widgetConfig.icon },
      color: { type: String, default: DEFAULT_APPEARANCE_CONFIG.widgetConfig.color },
    },
    embeddedConfig: {
      width: { type: Number, default: DEFAULT_APPEARANCE_CONFIG.embeddedConfig.width },
      height: { type: Number, default: DEFAULT_APPEARANCE_CONFIG.embeddedConfig.height },
      layout: { type: String, default: DEFAULT_APPEARANCE_CONFIG.embeddedConfig.layout },
    },
    companyName: { type: String, default: DEFAULT_APPEARANCE_CONFIG.companyName },
    logoUrl: { type: String, default: DEFAULT_APPEARANCE_CONFIG.logoUrl },
    customBranding: { type: Boolean, default: DEFAULT_APPEARANCE_CONFIG.customBranding },
    showPoweredBy: { type: Boolean, default: DEFAULT_APPEARANCE_CONFIG.showPoweredBy },
  },
  { _id: false },
);

const botSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
    role: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    tone: {
      type: String,
      enum: Object.values(BOT_TONE),
      default: BOT_TONE.PROFESSIONAL,
    },
    instructions: {
      type: String,
      trim: true,
      maxlength: 4000,
      default: "",
    },
    strictKnowledgeMode: {
      type: Boolean,
      default: false,
    },
    outputFormat: {
      type: String,
      enum: Object.values(BOT_OUTPUT_FORMAT),
      default: BOT_OUTPUT_FORMAT.PARAGRAPH,
    },
    theme: {
      type: String,
      trim: true,
      maxlength: 40,
      default: "light",
    },
    welcomeMessage: {
      type: String,
      trim: true,
      maxlength: 300,
      default: "Hi, how can I help you today?",
    },
    avatar: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
    visibility: {
      type: String,
      enum: Object.values(BOT_VISIBILITY),
      default: BOT_VISIBILITY.PRIVATE,
      index: true,
    },
    deploymentStatus: {
      type: String,
      enum: Object.values(BOT_DEPLOYMENT_STATUS),
      default: BOT_DEPLOYMENT_STATUS.DRAFT,
      index: true,
    },
    deploymentMode: {
      type: String,
      enum: Object.values(BOT_DEPLOYMENT_MODE),
      default: BOT_DEPLOYMENT_MODE.FULLSCREEN,
    },
    publicSlug: {
      type: String,
      trim: true,
      maxlength: 120,
      unique: true,
      sparse: true,
    },
    publicKey: {
      type: String,
      trim: true,
      maxlength: 120,
      unique: true,
      sparse: true,
      select: true,
    },
    sdkEnabled: {
      type: Boolean,
      default: false,
    },
    apiEnabled: {
      type: Boolean,
      default: false,
    },
    deployedAt: {
      type: Date,
      default: null,
    },
    analytics: {
      messages: { type: Number, default: 0 },
      conversations: { type: Number, default: 0 },
      visitors: { type: Number, default: 0 },
      sdkRequests: { type: Number, default: 0 },
      apiRequests: { type: Number, default: 0 },
      widgetRequests: { type: Number, default: 0 },
      lastUsedAt: { type: Date, default: null },
    },
    appearanceConfig: {
      type: appearanceConfigSchema,
      default: () => DEFAULT_APPEARANCE_CONFIG,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

botSchema.index({ ownerId: 1, createdAt: -1 });
botSchema.index({ ownerId: 1, name: 1 });
botSchema.index({ _id: 1, publicKey: 1, deploymentStatus: 1 });

botSchema.methods.toClientObject = function toClientObject() {
  return {
    id: this._id.toString(),
    ownerId: this.ownerId.toString(),
    name: this.name,
    description: this.description,
    role: this.role,
    tone: this.tone,
    instructions: this.instructions,
    strictKnowledgeMode: this.strictKnowledgeMode,
    outputFormat: this.outputFormat,
    theme: this.theme,
    welcomeMessage: this.welcomeMessage,
    avatar: this.avatar,
    visibility: this.visibility,
    deploymentStatus: this.deploymentStatus,
    deploymentMode: this.deploymentMode,
    publicSlug: this.publicSlug,
    publicKey: this.publicKey,
    sdkEnabled: this.sdkEnabled,
    apiEnabled: this.apiEnabled,
    deployedAt: this.deployedAt,
    analytics: this.analytics,
    appearanceConfig: {
      ...DEFAULT_APPEARANCE_CONFIG,
      ...(this.appearanceConfig?.toObject?.() ?? this.appearanceConfig ?? {}),
    },
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

botSchema.methods.toPublicRuntimeObject = function toPublicRuntimeObject() {
  return {
    id: this._id.toString(),
    name: this.name,
    description: this.description,
    theme: this.theme,
    welcomeMessage: this.welcomeMessage,
    avatar: this.avatar,
    visibility: this.visibility,
    deploymentStatus: this.deploymentStatus,
    deploymentMode: this.deploymentMode,
    publicSlug: this.publicSlug,
    publicKey: this.publicKey,
    sdkEnabled: this.sdkEnabled,
    apiEnabled: this.apiEnabled,
    appearanceConfig: {
      ...DEFAULT_APPEARANCE_CONFIG,
      ...(this.appearanceConfig?.toObject?.() ?? this.appearanceConfig ?? {}),
    },
  };
};

const Bot = mongoose.model("Bot", botSchema);

export default Bot;
