import { groqProvider } from "../../../providers/llm/groq.provider.js";

export const llmOrchestratorService = {
  async generateResponse({ systemPrompt, history, userMessage }) {
    const messages = [
      ...history.slice(-12).map((message) => ({
        role: message.role,
        content: message.content,
      })),
      {
        role: "user",
        content: userMessage,
      },
    ];

    return groqProvider.generateChatCompletion({
      systemPrompt,
      messages,
    });
  },
};
