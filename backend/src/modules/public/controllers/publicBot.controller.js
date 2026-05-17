import { publicBotService } from "../services/publicBot.service.js";
import asyncHandler from "../../../shared/utils/asyncHandler.js";
import ApiResponse from "../../../shared/utils/ApiResponse.js";
import { HTTP_STATUS } from "../../../shared/constants/httpStatus.js";

export const publicBotController = {
  getPublicBot: asyncHandler(async (req, res) => {
    const bot = await publicBotService.getPublicBot(req.validated.params.botId);

    return res
      .status(HTTP_STATUS.OK)
      .json(new ApiResponse(HTTP_STATUS.OK, "Public bot fetched successfully", { bot }));
  }),
};
