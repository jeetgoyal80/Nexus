import ApiError from "../../../shared/utils/ApiError.js";
import { HTTP_STATUS } from "../../../shared/constants/httpStatus.js";
import { groqProvider } from "../../../providers/llm/groq.provider.js";
import { usageService } from "../../billing/services/usage.service.js";
import { featureGateService } from "../../billing/services/featureGate.service.js";

export const runtimeService = {
  async testGroqKey(apiKey) {
    if (!apiKey?.startsWith("gsk_")) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Invalid Groq API key format.");
    }

    await groqProvider.generateChatCompletion({
      apiKey,
      systemPrompt: "You are validating a Groq API key. Reply with OK.",
      messages: [{ role: "user", content: "ping" }],
      maxTokens: 8,
    });

    return { valid: true };
  },

  getUsage(userId) {
    return usageService.getUsageSummary(userId);
  },

  async getRuntimeOverview(user) {
    const usage = await usageService.getUsageSummary(user.id);
    return {
      usage,
      entitlements: featureGateService.getEntitlements(user),
    };
  },
};
