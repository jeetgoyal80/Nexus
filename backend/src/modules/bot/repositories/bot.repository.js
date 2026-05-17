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

  deleteBotByIdAndOwner(botId, ownerId) {
    return Bot.findOneAndDelete({ _id: botId, ownerId });
  },
};
