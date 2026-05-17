import crypto from "crypto";
import mongoose from "mongoose";
import ApiError from "../../../shared/utils/ApiError.js";
import { HTTP_STATUS } from "../../../shared/constants/httpStatus.js";
import { BOT_VISIBILITY } from "../../bot/constants/bot.constants.js";
import { botRepository } from "../../bot/repositories/bot.repository.js";
import { chatRepository } from "../repositories/chat.repository.js";
import { promptBuilderService } from "./promptBuilder.service.js";
import { llmOrchestratorService } from "./llmOrchestrator.service.js";
import { outputFormatterService } from "./outputFormatter.service.js";
import { ragClientService } from "../../rag/services/ragClient.service.js";

const assertValidObjectId = (id, resourceName = "Resource") => {
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

export const chatService = {
  async executeChat({ botId, user, message, conversationId, sessionId }) {
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

    let conversation = null;

    if (conversationId) {
      conversation = await chatRepository.findConversation({
        botId,
        conversationId,
        userId,
        sessionId: resolvedSessionId,
      });

      if (!conversation) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, "Conversation not found");
      }
    } else {
      conversation = await chatRepository.createConversation({
        botId,
        userId,
        sessionId: resolvedSessionId,
        messages: [],
      });
    }

    const history = conversation.messages || [];
    const retrievedContext = await ragClientService.retrieveContext({
      botId,
      query: message,
    });

    const systemPrompt = promptBuilderService.buildPrompt({
      role: bot.role,
      tone: bot.tone,
      instructions: bot.instructions,
      outputFormat: bot.outputFormat,
      history,
      retrievedContext,
      userMessage: message,
    });

    const llmResult = await llmOrchestratorService.generateResponse({
      systemPrompt,
      history,
      userMessage: message,
    });

    const formattedResponse = outputFormatterService.format(llmResult.content, bot.outputFormat);

    const updatedConversation = await chatRepository.appendMessages(conversation._id, [
      {
        role: "user",
        content: message,
      },
      {
        role: "assistant",
        content: formattedResponse,
        metadata: {
          provider: llmResult.provider,
          model: llmResult.model,
          usage: llmResult.usage,
        },
      },
    ]);

    return {
      conversationId: updatedConversation._id.toString(),
      sessionId: updatedConversation.sessionId,
      response: formattedResponse,
      provider: llmResult.provider,
      model: llmResult.model,
    };
  },
};
