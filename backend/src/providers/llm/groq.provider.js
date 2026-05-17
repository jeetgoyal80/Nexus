import { env } from "../../config/env.js";
import ApiError from "../../shared/utils/ApiError.js";
import { HTTP_STATUS } from "../../shared/constants/httpStatus.js";

const GROQ_CHAT_COMPLETIONS_URL = "https://api.groq.com/openai/v1/chat/completions";

export const groqProvider = {
  async generateChatCompletion({ systemPrompt, messages, temperature = 0.4 }) {
    if (!env.GROQ_API_KEY) {
      throw new ApiError(
        HTTP_STATUS.SERVICE_UNAVAILABLE,
        "Groq provider is not configured. Set GROQ_API_KEY in environment variables.",
      );
    }

    const response = await fetch(GROQ_CHAT_COMPLETIONS_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: env.GROQ_MODEL,
        temperature,
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          ...messages,
        ],
      }),
    });

    const payload = await response.json();

    if (!response.ok) {
      throw new ApiError(
        HTTP_STATUS.SERVICE_UNAVAILABLE,
        payload?.error?.message || "Groq provider request failed",
      );
    }

    const content = payload?.choices?.[0]?.message?.content;

    if (!content) {
      throw new ApiError(HTTP_STATUS.SERVICE_UNAVAILABLE, "Groq provider returned an empty response");
    }

    return {
      content,
      provider: "groq",
      model: payload.model || env.GROQ_MODEL,
      usage: payload.usage || null,
    };
  },
};
