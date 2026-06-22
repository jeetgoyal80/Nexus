import { chatRepository } from "../repositories/chat.repository.js";
import { chatRuntimeService } from "./chatRuntime.service.js";
import { llmStreamingService } from "./llmStreaming.service.js";
import { outputFormatterService } from "./outputFormatter.service.js";
import { promptBuilderService } from "./promptBuilder.service.js";
import { ragClientService } from "../../rag/services/ragClient.service.js";
import { sseService } from "./sse.service.js";
import { usageService } from "../../billing/services/usage.service.js";

export const streamingChatService = {
  async executeStream({ botId, user, message, conversationId, sessionId, res, signal }) {
    sseService.init(res);
    const heartbeat = sseService.startHeartbeat(res);

    try {
      const { bot, conversation } = await chatRuntimeService.prepareRuntime({
        botId,
        user,
        conversationId,
        sessionId,
      });

      await usageService.assertHostedRuntimeAllowed(bot);

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

      sseService.sendMetadata(res, {
        conversationId: conversation._id.toString(),
        sessionId: conversation.sessionId,
        contextCount: retrievedContext.length,
      });

      let response = "";
      let provider = "groq";
      let model = null;

      for await (const chunk of llmStreamingService.streamResponse({
        bot,
        systemPrompt,
        history,
        userMessage: message,
        signal,
      })) {
        provider = chunk.provider || provider;
        model = chunk.model || model;
        response += chunk.token;
        sseService.sendToken(res, chunk.token);
      }

      const formattedResponse = outputFormatterService.format(response, bot.outputFormat);
      const updatedConversation = await chatRepository.appendMessages(conversation._id, [
        {
          role: "user",
          content: message,
        },
        {
          role: "assistant",
          content: formattedResponse,
          metadata: {
            provider,
            model,
            streamed: true,
          },
        },
      ]);

      await usageService.incrementHostedUsage(bot);

      sseService.sendDone(res, {
        conversationId: updatedConversation._id.toString(),
        sessionId: updatedConversation.sessionId,
        provider,
        model,
      });
    } catch (error) {
      if (!signal.aborted) {
        sseService.sendError(res, error);
      }
    } finally {
      clearInterval(heartbeat);
      sseService.close(res);
    }
  },
};
