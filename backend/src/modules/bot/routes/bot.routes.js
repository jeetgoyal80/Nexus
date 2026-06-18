import { Router } from "express";
import { botController } from "../controllers/bot.controller.js";
import { authenticate } from "../../auth/middleware/auth.middleware.js";
import {
  botIdParamSchema,
  createBotSchema,
  updateBotSchema,
  validate,
} from "../validators/bot.validation.js";

const router = Router();

router.use(authenticate);

router.post("/", validate(createBotSchema), botController.createBot);
router.get("/", botController.getMyBots);
router.get("/:id", validate(botIdParamSchema), botController.getBotById);
router.put("/:id", validate(updateBotSchema), botController.updateBot);
router.post("/:id/deploy", validate(botIdParamSchema), botController.deployBot);
router.post("/:id/unpublish", validate(botIdParamSchema), botController.unpublishBot);
router.delete("/:id", validate(botIdParamSchema), botController.deleteBot);

export default router;
