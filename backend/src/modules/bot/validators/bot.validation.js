import { z } from "zod";
import ApiError from "../../../shared/utils/ApiError.js";
import { HTTP_STATUS } from "../../../shared/constants/httpStatus.js";
import {
  BOT_OUTPUT_FORMAT,
  BOT_TONE,
  BOT_VISIBILITY,
} from "../constants/bot.constants.js";

const createBotFields = {
  name: z.string().trim().min(2).max(80),
  description: z.string().trim().max(500).optional().default(""),
  role: z.string().trim().min(2).max(120),
  tone: z.enum(Object.values(BOT_TONE)).optional(),
  instructions: z.string().trim().max(4000).optional().default(""),
  outputFormat: z.enum(Object.values(BOT_OUTPUT_FORMAT)).optional(),
  theme: z.string().trim().min(2).max(40).optional(),
  welcomeMessage: z.string().trim().max(300).optional(),
  avatar: z.string().trim().max(500).optional(),
  visibility: z.enum(Object.values(BOT_VISIBILITY)).optional(),
};

const updateBotFields = {
  name: z.string().trim().min(2).max(80).optional(),
  description: z.string().trim().max(500).optional(),
  role: z.string().trim().min(2).max(120).optional(),
  tone: z.enum(Object.values(BOT_TONE)).optional(),
  instructions: z.string().trim().max(4000).optional(),
  outputFormat: z.enum(Object.values(BOT_OUTPUT_FORMAT)).optional(),
  theme: z.string().trim().min(2).max(40).optional(),
  welcomeMessage: z.string().trim().max(300).optional(),
  avatar: z.string().trim().max(500).optional(),
  visibility: z.enum(Object.values(BOT_VISIBILITY)).optional(),
};

export const createBotSchema = z.object({
  body: z.object(createBotFields),
});

export const updateBotSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Bot id is required"),
  }),
  body: z
    .object(updateBotFields)
    .refine((payload) => Object.keys(payload).length > 0, {
      message: "At least one field is required for update",
    }),
});

export const botIdParamSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Bot id is required"),
  }),
});

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query,
  });

  if (!result.success) {
    return next(
      new ApiError(
        HTTP_STATUS.UNPROCESSABLE_ENTITY,
        "Request validation failed",
        result.error.flatten().fieldErrors,
      ),
    );
  }

  req.validated = result.data;
  return next();
};
