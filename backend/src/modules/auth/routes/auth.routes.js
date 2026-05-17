import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import {
  googleLoginSchema,
  loginSchema,
  signupSchema,
  validate,
} from "../validators/auth.validation.js";
import { authRateLimiter } from "../../../shared/middleware/rateLimit.middleware.js";

const router = Router();

router.post("/signup", authRateLimiter, validate(signupSchema), authController.signup);
router.post("/login", authRateLimiter, validate(loginSchema), authController.login);
router.post("/google", authRateLimiter, validate(googleLoginSchema), authController.googleLogin);
router.post("/logout", authController.logout);
router.post("/refresh", authRateLimiter, authController.refresh);
router.get("/me", authenticate, authController.me);

export default router;
