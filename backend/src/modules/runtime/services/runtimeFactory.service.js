import { env } from "../../../config/env.js";
import { RUNTIME_PROVIDER } from "../../../config/plans.js";
import { encryptionService } from "../../../shared/services/encryption.service.js";
import ApiError from "../../../shared/utils/ApiError.js";
import { HTTP_STATUS } from "../../../shared/constants/httpStatus.js";

export const runtimeFactoryService = {
  resolveGroqRuntime(bot) {
    const model = bot.model || env.GROQ_MODEL;

    if (bot.runtimeProvider === RUNTIME_PROVIDER.USER) {
      const apiKey = encryptionService.decrypt(bot.encryptedApiKey);

      if (!apiKey) {
        throw new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          "This bot uses BYOK runtime but no Groq API key is configured.",
        );
      }

      return {
        apiKey,
        model,
        runtimeProvider: RUNTIME_PROVIDER.USER,
      };
    }

    if (!env.GROQ_API_KEY) {
      throw new ApiError(
        HTTP_STATUS.SERVICE_UNAVAILABLE,
        "Platform runtime is not configured. Set GROQ_API_KEY.",
      );
    }

    return {
      apiKey: env.GROQ_API_KEY,
      model,
      runtimeProvider: RUNTIME_PROVIDER.PLATFORM,
    };
  },
};
