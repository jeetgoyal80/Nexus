import { z } from "zod";
import ApiError from "../../../shared/utils/ApiError.js";
import { HTTP_STATUS } from "../../../shared/constants/httpStatus.js";

export const chatMessageSchema = z.object({
  params: z.object({
    botId: z.string().min(1, "Bot id is required"),
  }),
  body: z.object({
    message: z.string().trim().min(1).max(4000),
    conversationId: z.preprocess(
      (value) => (value === null || value === "" ? undefined : value),
      z.string().trim().optional(),
    ),
    sessionId: z.preprocess(
      (value) => (value === null || value === "" ? undefined : value),
      z.string().trim().max(120).optional(),
    ),
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
