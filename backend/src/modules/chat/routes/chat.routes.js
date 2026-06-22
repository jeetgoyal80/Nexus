import { Router } from "express";
import { optionalAuthenticate } from "../../auth/middleware/auth.middleware.js";
import { chatController } from "../controllers/chat.controller.js";
import { chatMessageSchema, validate } from "../validators/chat.validation.js";
import { chatRateLimiter } from "../../../shared/middleware/rateLimit.middleware.js";

const router = Router();

router.post(
  "/stream/:botId",
  chatRateLimiter,
  optionalAuthenticate,
  validate(chatMessageSchema),
  chatController.streamChat,
);
router.post(
  "/:botId",
  chatRateLimiter,
  optionalAuthenticate,
  validate(chatMessageSchema),
  chatController.executeChat,
);

export default router;
