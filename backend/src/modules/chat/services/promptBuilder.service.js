import { BOT_OUTPUT_FORMAT } from "../../bot/constants/bot.constants.js";

const outputFormatInstructions = {
  [BOT_OUTPUT_FORMAT.PARAGRAPH]: "Respond in clear, well-structured paragraphs.",
  [BOT_OUTPUT_FORMAT.BULLET_POINTS]: "Respond using concise bullet points.",
  [BOT_OUTPUT_FORMAT.STRUCTURED_JSON]: "Respond as valid JSON that matches the user's intent.",
};

const formatHistory = (history = []) => {
  return history
    .slice(-12)
    .map((message) => `${message.role.toUpperCase()}: ${message.content}`)
    .join("\n");
};

export const promptBuilderService = {
  buildPrompt({ role, tone, instructions, outputFormat, history = [], retrievedContext = [], userMessage }) {
    const sections = [
      "You are the runtime engine for a configurable SaaS chatbot.",
      `Role: ${role}`,
      `Tone: ${tone}`,
      `Output Format: ${outputFormatInstructions[outputFormat] || outputFormatInstructions.paragraph}`,
      "Stay within the configured behavior. Do not claim access to documents or tools that were not provided.",
    ];

    if (instructions) {
      sections.push(`Custom Instructions: ${instructions}`);
    }

    const conversationContext = formatHistory(history);

    if (conversationContext) {
      sections.push(`Conversation History:\n${conversationContext}`);
    }

    if (retrievedContext.length > 0) {
      sections.push(
        `Relevant Retrieved Context:\n${retrievedContext
          .map((context, index) => `[${index + 1}] ${context}`)
          .join("\n\n")}`,
      );
      sections.push("Use the retrieved context when it is relevant. If the context is insufficient, say so clearly.");
    }

    sections.push(`User Message: ${userMessage}`);

    return sections.join("\n\n");
  },
};
