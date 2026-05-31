import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(5000),
  MONGO_URI: z.string().min(1, "MONGO_URI is required"),
  JWT_ACCESS_SECRET: z.string().min(16, "JWT_ACCESS_SECRET must be at least 16 characters"),
  JWT_REFRESH_SECRET: z.string().min(16, "JWT_REFRESH_SECRET must be at least 16 characters"),
  ACCESS_TOKEN_EXPIRES: z.string().default("15m"),
  REFRESH_TOKEN_EXPIRES: z.string().default("7d"),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GROQ_API_KEY: z.string().optional(),
  GROQ_MODEL: z.string().default("llama-3.1-8b-instant"),
  GROQ_MAX_COMPLETION_TOKENS: z.coerce.number().default(700),
  RAG_SERVICE_URL: z.string().url().default("http://localhost:8001"),
  RAG_TOP_K: z.coerce.number().default(3),
  RAG_CONTEXT_MAX_CHARS: z.coerce.number().default(4500),
  RAG_CONTEXT_CHUNK_MAX_CHARS: z.coerce.number().default(1500),
  CHAT_HISTORY_LIMIT: z.coerce.number().default(4),
  REDIS_URL: z.string().default("redis://localhost:6379"),
  REDIS_TLS_REJECT_UNAUTHORIZED: z
    .enum(["true", "false"])
    .default("true")
    .transform((value) => value === "true"),
  REDIS_CONNECT_TIMEOUT_MS: z.coerce.number().default(10000),
  REDIS_MAX_RECONNECT_DELAY_MS: z.coerce.number().default(10000),
  UPLOAD_DIR: z.string().default("uploads"),
  INGESTION_WORKER_CONCURRENCY: z.coerce.number().default(2),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
  COOKIE_DOMAIN: z.string().optional(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid environment configuration", parsedEnv.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = {
  ...parsedEnv.data,
  isProduction: parsedEnv.data.NODE_ENV === "production",
};
