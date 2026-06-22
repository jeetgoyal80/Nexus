import { groqProvider } from "../../../providers/llm/groq.provider.js";
import { env } from "../../../config/env.js";
import { runtimeFactoryService } from "../../runtime/services/runtimeFactory.service.js";

export const llmOrchestratorService = {
  buildMessages({ history, userMessage }) {
    return [
      ...history.slice(-env.CHAT_HISTORY_LIMIT).map((message) => ({
        role: message.role,
        content: message.content,
      })),
      {
        role: "user",
        content: userMessage,
      },
    ];
  },

  async generateResponse({ bot, systemPrompt, history, userMessage }) {
    const messages = this.buildMessages({ history, userMessage });
    const runtime = runtimeFactoryService.resolveGroqRuntime(bot);

    return groqProvider.generateChatCompletion({
      systemPrompt,
      messages,
      apiKey: runtime.apiKey,
      model: runtime.model,
    });
  },

  streamResponse({ bot, systemPrompt, history, userMessage, signal }) {
    const messages = this.buildMessages({ history, userMessage });
    const runtime = runtimeFactoryService.resolveGroqRuntime(bot);

    return groqProvider.streamChatCompletion({
      systemPrompt,
      messages,
      signal,
      apiKey: runtime.apiKey,
      model: runtime.model,
    });
  },
};
