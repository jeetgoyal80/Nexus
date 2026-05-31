import { groqProvider } from "../../../providers/llm/groq.provider.js";
import { env } from "../../../config/env.js";

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

  async generateResponse({ systemPrompt, history, userMessage }) {
    const messages = this.buildMessages({ history, userMessage });

    return groqProvider.generateChatCompletion({
      systemPrompt,
      messages,
    });
  },

  streamResponse({ systemPrompt, history, userMessage, signal }) {
    const messages = this.buildMessages({ history, userMessage });

    return groqProvider.streamChatCompletion({
      systemPrompt,
      messages,
      signal,
    });
  },
};
