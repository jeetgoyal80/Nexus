import { groqProvider } from "../../../providers/llm/groq.provider.js";

export const llmOrchestratorService = {
  buildMessages({ history, userMessage }) {
    return [
      ...history.slice(-12).map((message) => ({
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
