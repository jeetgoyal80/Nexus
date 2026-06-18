import { Router } from "express";
import { publicBotController } from "../controllers/publicBot.controller.js";
import { publicChatRateLimiter } from "../../../shared/middleware/rateLimit.middleware.js";
import {
  publicBotIdParamSchema,
  publicChatSchema,
  validate,
} from "../validators/public.validation.js";

const router = Router();

router.get("/bots/:botId", validate(publicBotIdParamSchema), publicBotController.getPublicBot);
router.get("/bots/:botId/config", validate(publicBotIdParamSchema), publicBotController.getPublicBotConfig);
router.post("/chat", publicChatRateLimiter, validate(publicChatSchema), publicBotController.executePublicChat);

export default router;
