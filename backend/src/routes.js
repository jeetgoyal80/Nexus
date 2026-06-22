import { Router } from "express";

import { checkRedisHealth } from "./infrastructure/redis/redisClient.js";
import { ingestionQueue } from "./infrastructure/queues/ingestion.queue.js";
import { authModule } from "./modules/auth/auth.module.js";
import { botModule } from "./modules/bot/bot.module.js";
import { chatModule } from "./modules/chat/chat.module.js";
import { documentModule } from "./modules/document/document.module.js";
import { publicModule } from "./modules/public/public.module.js";
import { runtimeModule } from "./modules/runtime/runtime.module.js";

const router = Router();

router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is healthy",
  });
});

router.get("/health/infrastructure", async (req, res, next) => {
  try {
    const redis = await checkRedisHealth();
    const ingestionQueueCounts = await ingestionQueue.getJobCounts(
      "waiting",
      "active",
      "completed",
      "failed",
      "delayed",
    );

    res.status(200).json({
      success: true,
      redis,
      queues: {
        ingestion: ingestionQueueCounts,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.use(authModule.path, authModule.routes);
router.use(botModule.path, botModule.routes);
router.use(documentModule.path, documentModule.routes);
router.use(chatModule.path, chatModule.routes);
router.use(publicModule.path, publicModule.routes);
router.use(runtimeModule.path, runtimeModule.routes);

export default router;
