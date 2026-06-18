import mongoose from "mongoose";
import crypto from "crypto";
import ApiError from "../../../shared/utils/ApiError.js";
import { HTTP_STATUS } from "../../../shared/constants/httpStatus.js";
import { botRepository } from "../../bot/repositories/bot.repository.js";
import { chatRepository } from "../../chat/repositories/chat.repository.js";
import { promptBuilderService } from "../../chat/services/promptBuilder.service.js";
import { llmOrchestratorService } from "../../chat/services/llmOrchestrator.service.js";
import { outputFormatterService } from "../../chat/services/outputFormatter.service.js";
import { ragClientService } from "../../rag/services/ragClient.service.js";
import { analyticsService } from "../../analytics/services/analytics.service.js";

const assertValidBotId = (botId) => {
  if (!mongoose.Types.ObjectId.isValid(botId)) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Bot id is invalid");
  }
};

const assertPublicRuntimeEnabled = (bot, { requireApi = false } = {}) => {
  if (!bot || bot.visibility !== "public" || bot.deploymentStatus !== "deployed") {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Deployed public bot not found");
  }

  if (requireApi && !bot.apiEnabled) {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, "Public API is disabled for this bot");
  }

  if (!bot.sdkEnabled && !bot.apiEnabled) {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, "Public runtime is disabled for this bot");
  }
};

export const publicBotService = {
  async getPublicBot(botId) {
    assertValidBotId(botId);

    const bot = await botRepository.findDeployedPublicBotById(botId);

    assertPublicRuntimeEnabled(bot);

    return bot.toPublicRuntimeObject();
  },

  async getPublicBotConfig(botId) {
    const bot = await this.getPublicBot(botId);

    return {
      botId: bot.id,
      name: bot.name,
      appearanceConfig: bot.appearanceConfig,
      deploymentMode: bot.deploymentMode,
      avatarUrl: bot.appearanceConfig?.avatarUrl || bot.avatar,
      publicKey: bot.publicKey,
    };
  },

  async executePublicChat({
    botId,
    publicKey,
    message,
    conversationId,
    sessionId,
    channel = "public_api",
    requestMeta = {},
  }) {
    assertValidBotId(botId);

    if (conversationId && !mongoose.Types.ObjectId.isValid(conversationId)) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Conversation id is invalid");
    }

    const bot = await botRepository.findPublicBotByKey(botId, publicKey);
    assertPublicRuntimeEnabled(bot, { requireApi: true });

    const resolvedSessionId = sessionId || crypto.randomUUID();
    const conversation = conversationId
      ? await chatRepository.findConversation({
          botId,
          conversationId,
          userId: null,
          sessionId: resolvedSessionId,
        })
      : await chatRepository.createConversation({
          botId,
          userId: null,
          sessionId: resolvedSessionId,
          messages: [],
        });

    if (!conversation) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Conversation not found");
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
      strictKnowledgeMode: bot.strictKnowledgeMode,
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
      { role: "user", content: message },
      {
        role: "assistant",
        content: formattedResponse,
        metadata: {
          provider: llmResult.provider,
          model: llmResult.model,
          usage: llmResult.usage,
          publicKey,
        },
      },
    ]);

    await botRepository.incrementAnalytics(botId, {
      messages: 1,
      sdkRequests: channel === "react_sdk" ? 1 : 0,
      widgetRequests: channel === "widget" ? 1 : 0,
      apiRequests: channel === "public_api" || channel === "public_page" ? 1 : 0,
      conversations: conversationId ? 0 : 1,
    });

    await analyticsService.trackRuntimeEvents({
      botId,
      conversationId: updatedConversation._id,
      publicKey,
      sessionId: updatedConversation.sessionId,
      channel,
      ip: requestMeta.ip,
      userAgent: requestMeta.userAgent,
      isNewConversation: !conversationId,
    });

    return {
      response: formattedResponse,
      conversationId: updatedConversation._id.toString(),
      sessionId: updatedConversation.sessionId,
      sources: retrievedContext?.contexts ?? [],
    };
  },
};
