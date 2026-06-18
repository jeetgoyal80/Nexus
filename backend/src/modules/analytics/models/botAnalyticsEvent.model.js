import mongoose from "mongoose";

const botAnalyticsEventSchema = new mongoose.Schema(
  {
    botId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bot",
      required: true,
      index: true,
    },
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      default: null,
      index: true,
    },
    eventType: {
      type: String,
      enum: ["visitor", "conversation", "message", "sdk_request", "api_request", "widget_request"],
      required: true,
      index: true,
    },
    channel: {
      type: String,
      enum: ["public_api", "react_sdk", "widget", "public_page"],
      default: "public_api",
      index: true,
    },
    publicKeyPrefix: {
      type: String,
      default: null,
    },
    sessionId: {
      type: String,
      default: null,
      index: true,
    },
    ipHash: {
      type: String,
      default: null,
    },
    userAgent: {
      type: String,
      default: null,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

botAnalyticsEventSchema.index({ botId: 1, eventType: 1, createdAt: -1 });

const BotAnalyticsEvent = mongoose.model("BotAnalyticsEvent", botAnalyticsEventSchema);

export default BotAnalyticsEvent;
