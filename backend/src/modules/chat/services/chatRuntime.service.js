import crypto from "crypto";
import mongoose from "mongoose";
import ApiError from "../../../shared/utils/ApiError.js";
import { HTTP_STATUS } from "../../../shared/constants/httpStatus.js";
import { BOT_VISIBILITY } from "../../bot/constants/bot.constants.js";
import { botRepository } from "../../bot/repositories/bot.repository.js";
import { chatRepository } from "../repositories/chat.repository.js";

export const assertValidObjectId = (id, resourceName = "Resource") => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, `${resourceName} id is invalid`);
  }
};

const canAccessBotRuntime = (bot, user) => {
  if (bot.visibility === BOT_VISIBILITY.PUBLIC) {
    return true;
  }

  return Boolean(user?.id && bot.ownerId.toString() === user.id);
};

export const chatRuntimeService = {
  async prepareRuntime({ botId, user, conversationId, sessionId }) {
    assertValidObjectId(botId, "Bot");

    if (conversationId) {
      assertValidObjectId(conversationId, "Conversation");
    }

    const bot = await botRepository.findBotById(botId);

    if (!bot || !canAccessBotRuntime(bot, user)) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Bot runtime not found");
    }

    const resolvedSessionId = user?.id ? null : sessionId || crypto.randomUUID();
    const userId = user?.id || null;

    if (conversationId) {
      const conversation = await chatRepository.findConversation({
        botId,
        conversationId,
        userId,
        sessionId: resolvedSessionId,
      });

      if (!conversation) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, "Conversation not found");
      }

      return {
        bot,
        conversation,
        userId,
        sessionId: resolvedSessionId,
      };
    }

    const conversation = await chatRepository.createConversation({
      botId,
      userId,
      sessionId: resolvedSessionId,
      messages: [],
    });

    return {
      bot,
      conversation,
      userId,
      sessionId: resolvedSessionId,
    };
  },
};
