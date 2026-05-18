import mongoose from "mongoose";
import ApiError from "../../../shared/utils/ApiError.js";
import { HTTP_STATUS } from "../../../shared/constants/httpStatus.js";
import { botRepository } from "../repositories/bot.repository.js";

const assertValidObjectId = (id, resourceName = "Resource") => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, `${resourceName} id is invalid`);
  }
};

const sanitizeUpdatePayload = (payload) => {
  const allowedFields = [
    "name",
    "description",
    "role",
    "tone",
    "instructions",
    "strictKnowledgeMode",
    "outputFormat",
    "theme",
    "welcomeMessage",
    "avatar",
    "visibility",
  ];

  return allowedFields.reduce((update, field) => {
    if (payload[field] !== undefined) {
      update[field] = payload[field];
    }

    return update;
  }, {});
};

export const botService = {
  async createBot(ownerId, payload) {
    const bot = await botRepository.createBot({
      ...payload,
      ownerId,
    });

    return bot.toClientObject();
  },

  async getMyBots(ownerId) {
    const bots = await botRepository.getBotsByOwner(ownerId);
    return bots.map((bot) => bot.toClientObject());
  },

  async getBotById(ownerId, botId) {
    assertValidObjectId(botId, "Bot");

    const bot = await botRepository.findBotByIdAndOwner(botId, ownerId);

    if (!bot) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Bot not found");
    }

    return bot.toClientObject();
  },

  async updateBot(ownerId, botId, payload) {
    assertValidObjectId(botId, "Bot");

    const updatePayload = sanitizeUpdatePayload(payload);
    const bot = await botRepository.updateBotByIdAndOwner(botId, ownerId, updatePayload);

    if (!bot) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Bot not found");
    }

    return bot.toClientObject();
  },

  async deleteBot(ownerId, botId) {
    assertValidObjectId(botId, "Bot");

    const bot = await botRepository.deleteBotByIdAndOwner(botId, ownerId);

    if (!bot) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Bot not found");
    }

    return bot.toClientObject();
  },
};
