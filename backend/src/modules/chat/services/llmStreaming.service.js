import { llmOrchestratorService } from "./llmOrchestrator.service.js";

export const llmStreamingService = {
  streamResponse({ bot, systemPrompt, history, userMessage, signal }) {
    return llmOrchestratorService.streamResponse({
      bot,
      systemPrompt,
      history,
      userMessage,
      signal,
    });
  },
};
