import asyncHandler from "../../../shared/utils/asyncHandler.js";
import ApiResponse from "../../../shared/utils/ApiResponse.js";
import { HTTP_STATUS } from "../../../shared/constants/httpStatus.js";
import { runtimeService } from "../services/runtime.service.js";

export const runtimeController = {
  testKey: asyncHandler(async (req, res) => {
    const result = await runtimeService.testGroqKey(req.validated.body.apiKey);

    return res
      .status(HTTP_STATUS.OK)
      .json(new ApiResponse(HTTP_STATUS.OK, "Groq key validated successfully", result));
  }),

  usage: asyncHandler(async (req, res) => {
    const result = await runtimeService.getRuntimeOverview(req.user);

    return res
      .status(HTTP_STATUS.OK)
      .json(new ApiResponse(HTTP_STATUS.OK, "Runtime usage fetched successfully", result));
  }),
};
