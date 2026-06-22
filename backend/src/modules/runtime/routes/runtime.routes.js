import { Router } from "express";
import { authenticate } from "../../auth/middleware/auth.middleware.js";
import { runtimeController } from "../controllers/runtime.controller.js";
import { testKeySchema, validate } from "../validators/runtime.validation.js";

const router = Router();

router.get("/usage", authenticate, runtimeController.usage);
router.post("/test-key", authenticate, validate(testKeySchema), runtimeController.testKey);

export default router;
