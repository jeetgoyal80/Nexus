import crypto from "crypto";
import { analyticsRepository } from "../repositories/analytics.repository.js";

const hashIp = (ip) => {
  if (!ip) {
    return null;
  }

  return crypto.createHash("sha256").update(ip).digest("hex");
};

const publicKeyPrefix = (publicKey) => {
  if (!publicKey) {
    return null;
  }

  return publicKey.slice(0, 12);
};

export const analyticsService = {
  async trackRuntimeEvents({
    botId,
    conversationId,
    publicKey,
    sessionId,
    channel,
    ip,
    userAgent,
    isNewConversation,
  }) {
    const basePayload = {
      botId,
      conversationId,
      channel,
      sessionId,
      publicKeyPrefix: publicKeyPrefix(publicKey),
      ipHash: hashIp(ip),
      userAgent,
    };

    const events = [
      analyticsRepository.createEvent({ ...basePayload, eventType: "message" }),
      analyticsRepository.createEvent({
        ...basePayload,
        eventType: channel === "widget" ? "widget_request" : channel === "react_sdk" ? "sdk_request" : "api_request",
      }),
    ];

    if (isNewConversation) {
      events.push(analyticsRepository.createEvent({ ...basePayload, eventType: "conversation" }));
    }

    await Promise.allSettled(events);
  },
};
