import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import routes from "../routes.js";
import errorMiddleware from "../shared/middleware/error.middleware.js";
import ApiError from "../shared/utils/ApiError.js";
import { HTTP_STATUS } from "../shared/constants/httpStatus.js";
import { env } from "../config/env.js";

const app = express();
const corsOrigins = env.CORS_ORIGIN.split(",").map((origin) => origin.trim());
const isLocalDevOrigin = (origin) => {
  if (env.isProduction || !origin) {
    return false;
  }

  try {
    const { hostname } = new URL(origin);
    return hostname === "localhost" || hostname === "127.0.0.1";
  } catch {
    return false;
  }
};

app.use(helmet());

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || corsOrigins.includes(origin) || isLocalDevOrigin(origin)) {
        callback(null, true);
        return;
      }

      callback(new ApiError(HTTP_STATUS.FORBIDDEN, `CORS origin not allowed: ${origin}`));
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());

app.use(morgan("dev"));

app.use("/api", routes);

app.use((req, res, next) => {
  next(new ApiError(HTTP_STATUS.NOT_FOUND, `Route not found: ${req.method} ${req.originalUrl}`));
});

app.use(errorMiddleware);

export default app;
