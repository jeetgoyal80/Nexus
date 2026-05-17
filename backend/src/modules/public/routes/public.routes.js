import { Router } from "express";
import { publicBotController } from "../controllers/publicBot.controller.js";
import { publicBotIdParamSchema, validate } from "../validators/public.validation.js";

const router = Router();

router.get("/bots/:botId", validate(publicBotIdParamSchema), publicBotController.getPublicBot);

export default router;
