import asyncHandler from "../utils/asyncHandler.js";
import { botRepository } from "../../modules/bot/repositories/bot.repository.js";
import { usageService } from "../../modules/billing/services/usage.service.js";

export const enforceHostedRuntimeLimit = asyncHandler(async (req, res, next) => {
  const botId = req.params.botId || req.body.botId;
  if (!botId) return next();

  const bot = await botRepository.findBotById(botId);
  if (bot) {
    await usageService.assertHostedRuntimeAllowed(bot);
  }

  return next();
});
