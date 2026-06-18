import BotAnalyticsEvent from "../models/botAnalyticsEvent.model.js";

export const analyticsRepository = {
  createEvent(payload) {
    return BotAnalyticsEvent.create(payload);
  },

  aggregateByBot(botId) {
    return BotAnalyticsEvent.aggregate([
      { $match: { botId } },
      {
        $group: {
          _id: "$eventType",
          count: { $sum: 1 },
          lastSeenAt: { $max: "$createdAt" },
        },
      },
    ]);
  },
};
