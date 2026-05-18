import IORedis from "ioredis";
import { env } from "../../config/env.js";
import logger from "../../config/logger.js";

const isTlsRedisUrl = env.REDIS_URL.startsWith("rediss://");

const createRedisConnectionOptions = () => ({
  connectionName: "ai-chatbot-builder",
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
  connectTimeout: env.REDIS_CONNECT_TIMEOUT_MS,
  keepAlive: 30000,
  retryStrategy(times) {
    const delay = Math.min(times * 250, env.REDIS_MAX_RECONNECT_DELAY_MS);
    logger.warn("Redis reconnect scheduled", {
      attempt: times,
      delayMs: delay,
    });
    return delay;
  },
  reconnectOnError(error) {
    const message = error.message.toLowerCase();
    return message.includes("readonly") || message.includes("connection");
  },
  ...(isTlsRedisUrl
    ? {
        tls: {
          rejectUnauthorized: env.REDIS_TLS_REJECT_UNAUTHORIZED,
        },
      }
    : {}),
});

export const redisConnectionOptions = createRedisConnectionOptions();

export const redisConnection = new IORedis(env.REDIS_URL, redisConnectionOptions);

redisConnection.on("connect", () => {
  logger.info("Redis connection established", {
    mode: isTlsRedisUrl ? "tls" : "plain",
  });
});

redisConnection.on("error", (error) => {
  logger.error("Redis connection error", {
    message: error.message,
  });
});

export const checkRedisHealth = async () => {
  const result = await redisConnection.ping();
  return result === "PONG";
};
