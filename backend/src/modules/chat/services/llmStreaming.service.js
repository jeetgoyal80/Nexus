import { llmOrchestratorService } from "./llmOrchestrator.service.js";

export const llmStreamingService = {
  streamResponse({ systemPrompt, history, userMessage, signal }) {
    return llmOrchestratorService.streamResponse({
      systemPrompt,
      history,
      userMessage,
      signal,
    });
  },
};
