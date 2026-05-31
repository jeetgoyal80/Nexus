import { BOT_OUTPUT_FORMAT } from "../../bot/constants/bot.constants.js";

const outputFormatInstructions = {
  [BOT_OUTPUT_FORMAT.PARAGRAPH]: "Respond in clear, well-structured paragraphs.",
  [BOT_OUTPUT_FORMAT.BULLET_POINTS]: "Respond using concise bullet points.",
  [BOT_OUTPUT_FORMAT.STRUCTURED_JSON]: "Respond as valid JSON that matches the user's intent.",
};

export const promptBuilderService = {
  buildPrompt({
    role,
    tone,
    instructions,
    outputFormat,
    strictKnowledgeMode = false,
    retrievedContext = [],
  }) {
    const sections = [
      "You are the runtime engine for a configurable SaaS chatbot.",
      `Role: ${role}`,
      `Tone: ${tone}`,
      `Output Format: ${outputFormatInstructions[outputFormat] || outputFormatInstructions.paragraph}`,
      "Stay within the configured behavior. Do not claim access to documents or tools that were not provided.",
    ];

    if (strictKnowledgeMode) {
      sections.push(
        "Strict Knowledge Mode: Answer only from retrieved knowledge context. If the retrieved context does not contain the answer, clearly say that the answer is not available in the uploaded knowledge documents.",
      );
    }

    if (instructions) {
      sections.push(`Custom Instructions: ${instructions}`);
    }

    if (retrievedContext.length > 0) {
      sections.push(
        `Relevant Retrieved Context:\n${retrievedContext
          .map((context, index) => `[${index + 1}] ${context}`)
          .join("\n\n")}`,
      );
      sections.push("Use the retrieved context when it is relevant. If the context is insufficient, say so clearly.");
    } else if (strictKnowledgeMode) {
      sections.push(
        "Relevant Retrieved Context: No relevant uploaded knowledge was retrieved for this question. You must not answer from general knowledge.",
      );
    }

    return sections.join("\n\n");
  },
};
