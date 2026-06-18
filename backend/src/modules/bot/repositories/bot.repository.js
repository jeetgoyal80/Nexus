import Bot from "../models/bot.model.js";

export const botRepository = {
  createBot(payload) {
    return Bot.create(payload);
  },

  getBotsByOwner(ownerId) {
    return Bot.find({ ownerId }).sort({ createdAt: -1 });
  },

  findBotById(botId) {
    return Bot.findById(botId);
  },

  findPublicBotById(botId) {
    return Bot.findOne({ _id: botId, visibility: "public" });
  },

  findDeployedPublicBotById(botId) {
    return Bot.findOne({
      _id: botId,
      visibility: "public",
      deploymentStatus: "deployed",
    });
  },

  findPublicBotByKey(botId, publicKey) {
    return Bot.findOne({
      _id: botId,
      publicKey,
      visibility: "public",
      deploymentStatus: "deployed",
    });
  },

  findBotByIdAndOwner(botId, ownerId) {
    return Bot.findOne({ _id: botId, ownerId });
  },

  updateBotByIdAndOwner(botId, ownerId, payload) {
    return Bot.findOneAndUpdate(
      { _id: botId, ownerId },
      { $set: payload },
      { new: true, runValidators: true },
    );
  },

  incrementAnalytics(botId, counters = {}) {
    return Bot.findByIdAndUpdate(
      botId,
      {
        $inc: Object.fromEntries(
          Object.entries(counters).map(([key, value]) => [`analytics.${key}`, value]),
        ),
        $set: { "analytics.lastUsedAt": new Date() },
      },
      { new: true },
    );
  },

  findByPublicSlug(publicSlug) {
    return Bot.findOne({
      publicSlug,
      visibility: "public",
      deploymentStatus: "deployed",
    });
  },

  deleteBotByIdAndOwner(botId, ownerId) {
    return Bot.findOneAndDelete({ _id: botId, ownerId });
  },
};
