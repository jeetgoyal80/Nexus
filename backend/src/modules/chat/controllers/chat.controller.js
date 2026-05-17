import { chatService } from "../services/chat.service.js";
import asyncHandler from "../../../shared/utils/asyncHandler.js";
import ApiResponse from "../../../shared/utils/ApiResponse.js";
import { HTTP_STATUS } from "../../../shared/constants/httpStatus.js";

export const chatController = {
  executeChat: asyncHandler(async (req, res) => {
    const result = await chatService.executeChat({
      botId: req.validated.params.botId,
      user: req.user,
      message: req.validated.body.message,
      conversationId: req.validated.body.conversationId,
      sessionId: req.validated.body.sessionId,
    });

    return res
      .status(HTTP_STATUS.OK)
      .json(new ApiResponse(HTTP_STATUS.OK, "Chat response generated successfully", result));
  }),
};
