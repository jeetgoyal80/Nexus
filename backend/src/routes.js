import { Router } from "express";

import { authModule } from "./modules/auth/auth.module.js";
import { botModule } from "./modules/bot/bot.module.js";
import { chatModule } from "./modules/chat/chat.module.js";
import { publicModule } from "./modules/public/public.module.js";

const router = Router();

router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is healthy",
  });
});

router.use(authModule.path, authModule.routes);
router.use(botModule.path, botModule.routes);
router.use(chatModule.path, chatModule.routes);
router.use(publicModule.path, publicModule.routes);

export default router;
