import rateLimit from "express-rate-limit";
import { HTTP_STATUS } from "../constants/httpStatus.js";

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
    message: "Too many auth requests. Please try again later.",
  },
});
