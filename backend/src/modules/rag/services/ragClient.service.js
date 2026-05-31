import { env } from "../../../config/env.js";
import logger from "../../../config/logger.js";

const truncate = (value, maxLength) => {
  if (!value || value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength).trim()}...`;
};

const compactContexts = (contexts = []) => {
  let usedCharacters = 0;
  const compacted = [];

  for (const context of contexts) {
    const next = truncate(String(context), env.RAG_CONTEXT_CHUNK_MAX_CHARS);

    if (usedCharacters + next.length > env.RAG_CONTEXT_MAX_CHARS) {
      const remaining = env.RAG_CONTEXT_MAX_CHARS - usedCharacters;

      if (remaining > 300) {
        compacted.push(truncate(next, remaining));
      }

      break;
    }

    compacted.push(next);
    usedCharacters += next.length;
  }

  return compacted;
};

export const ragClientService = {
  async retrieveContext({ botId, query, topK = env.RAG_TOP_K }) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch(`${env.RAG_SERVICE_URL}/retrieve-context`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          botId,
          query,
          topK,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        logger.warn("RAG retrieval failed", {
          botId,
          status: response.status,
        });
        return [];
      }

      const payload = await response.json();
      return compactContexts(payload.contexts || []);
    } catch (error) {
      logger.warn("RAG retrieval unavailable", {
        botId,
        message: error.message,
      });
      return [];
    } finally {
      clearTimeout(timeout);
    }
  },
};
