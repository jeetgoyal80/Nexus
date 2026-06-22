import { env } from "../../../config/env.js";
import { getPlanLimits, RUNTIME_PROVIDER } from "../../../config/plans.js";
import ApiError from "../../../shared/utils/ApiError.js";
import { HTTP_STATUS } from "../../../shared/constants/httpStatus.js";
import { authRepository } from "../../auth/repositories/auth.repository.js";

const startOfToday = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

const isSameUsageDay = (date) => {
  if (!date) return false;
  const today = startOfToday();
  const current = new Date(date);
  return (
    current.getFullYear() === today.getFullYear() &&
    current.getMonth() === today.getMonth() &&
    current.getDate() === today.getDate()
  );
};

export const usageService = {
  async ensureCurrentUsageWindow(userId) {
    const user = await authRepository.findById(userId);
    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Runtime owner not found");
    }

    if (!isSameUsageDay(user.usage?.lastResetDate)) {
      user.usage = {
        messagesToday: 0,
        lastResetDate: startOfToday(),
      };
      await user.save();
    }

    return user;
  },

  async assertHostedRuntimeAllowed(bot) {
    if (env.BYPASS_BILLING || bot.runtimeProvider === RUNTIME_PROVIDER.USER) return null;

    const user = await this.ensureCurrentUsageWindow(bot.ownerId);
    const limit = getPlanLimits(user.subscriptionPlan).hostedMessagesPerDay;

    if ((user.usage?.messagesToday || 0) >= limit) {
      throw new ApiError(
        HTTP_STATUS.TOO_MANY_REQUESTS,
        "Daily hosted runtime limit reached. Upgrade to Pro or use your own Groq API key.",
      );
    }

    return user;
  },

  async incrementHostedUsage(bot) {
    if (env.BYPASS_BILLING || bot.runtimeProvider === RUNTIME_PROVIDER.USER) return;

    const user = await this.ensureCurrentUsageWindow(bot.ownerId);
    user.usage.messagesToday = (user.usage.messagesToday || 0) + 1;
    await user.save();
  },

  async getUsageSummary(userId) {
    const user = await this.ensureCurrentUsageWindow(userId);
    const limit = getPlanLimits(user.subscriptionPlan).hostedMessagesPerDay;

    return {
      subscriptionPlan: env.BYPASS_BILLING ? "pro" : user.subscriptionPlan,
      messagesToday: user.usage?.messagesToday || 0,
      hostedMessagesPerDay: env.BYPASS_BILLING ? Number.MAX_SAFE_INTEGER : limit,
      remainingHostedMessages: env.BYPASS_BILLING
        ? Number.MAX_SAFE_INTEGER
        : Math.max(0, limit - (user.usage?.messagesToday || 0)),
      lastResetDate: user.usage?.lastResetDate,
      bypassBilling: env.BYPASS_BILLING,
    };
  },
};
