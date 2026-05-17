import { env } from "../../../config/env.js";
import logger from "../../../config/logger.js";

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
      return payload.contexts || [];
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
