import { chatRepository } from "../repositories/chat.repository.js";
import { chatRuntimeService } from "./chatRuntime.service.js";
import { promptBuilderService } from "./promptBuilder.service.js";
import { llmOrchestratorService } from "./llmOrchestrator.service.js";
import { outputFormatterService } from "./outputFormatter.service.js";
import { ragClientService } from "../../rag/services/ragClient.service.js";

export const chatService = {
  async executeChat({ botId, user, message, conversationId, sessionId }) {
    const { bot, conversation } = await chatRuntimeService.prepareRuntime({
      botId,
      user,
      conversationId,
      sessionId,
    });

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
