import mongoose from "mongoose";
import ApiError from "../../../shared/utils/ApiError.js";
import { HTTP_STATUS } from "../../../shared/constants/httpStatus.js";
import { botRepository } from "../../bot/repositories/bot.repository.js";

export const publicBotService = {
  async getPublicBot(botId) {
    if (!mongoose.Types.ObjectId.isValid(botId)) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Bot id is invalid");
    }

    const bot = await botRepository.findPublicBotById(botId);

    if (!bot) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Public bot not found");
    }

    return bot.toPublicRuntimeObject();
  },
};
