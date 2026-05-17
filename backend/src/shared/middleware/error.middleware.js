import { HTTP_STATUS } from "../constants/httpStatus.js";
import { env } from "../../config/env.js";
import logger from "../../config/logger.js";

const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const message = err.message || "Internal Server Error";

  if (statusCode >= HTTP_STATUS.INTERNAL_SERVER_ERROR) {
    logger.error(message, {
      method: req.method,
      path: req.originalUrl,
      stack: err.stack,
    });
  }

  const response = {
    success: false,
    statusCode,
    message,
  };

  if (err.details) {
    response.details = err.details;
  }

  if (!env.isProduction && err.stack) {
    response.stack = err.stack;
  }

  return res.status(statusCode).json(response);
};

export default errorMiddleware;
