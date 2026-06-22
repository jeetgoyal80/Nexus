import { z } from "zod";
import ApiError from "../../../shared/utils/ApiError.js";
import { HTTP_STATUS } from "../../../shared/constants/httpStatus.js";

export const testKeySchema = z.object({
  body: z.object({
    apiKey: z.string().trim().min(20, "Groq API key is required").max(300),
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
