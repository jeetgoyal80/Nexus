import { botService } from "../services/bot.service.js";
import asyncHandler from "../../../shared/utils/asyncHandler.js";
import ApiResponse from "../../../shared/utils/ApiResponse.js";
import { HTTP_STATUS } from "../../../shared/constants/httpStatus.js";

export const botController = {
  createBot: asyncHandler(async (req, res) => {
    const bot = await botService.createBot(req.user.id, req.validated.body);

    return res
      .status(HTTP_STATUS.CREATED)
      .json(new ApiResponse(HTTP_STATUS.CREATED, "Bot created successfully", { bot }));
  }),

  getMyBots: asyncHandler(async (req, res) => {
    const bots = await botService.getMyBots(req.user.id);

    return res
      .status(HTTP_STATUS.OK)
      .json(new ApiResponse(HTTP_STATUS.OK, "Bots fetched successfully", { bots }));
  }),

  getBotById: asyncHandler(async (req, res) => {
    const bot = await botService.getBotById(req.user.id, req.validated.params.id);

    return res
      .status(HTTP_STATUS.OK)
      .json(new ApiResponse(HTTP_STATUS.OK, "Bot fetched successfully", { bot }));
  }),

  updateBot: asyncHandler(async (req, res) => {
    const bot = await botService.updateBot(
      req.user.id,
      req.validated.params.id,
      req.validated.body,
    );

    return res
      .status(HTTP_STATUS.OK)
      .json(new ApiResponse(HTTP_STATUS.OK, "Bot updated successfully", { bot }));
  }),

  deployBot: asyncHandler(async (req, res) => {
    const bot = await botService.deployBot(req.user.id, req.validated.params.id);

    return res
      .status(HTTP_STATUS.OK)
      .json(new ApiResponse(HTTP_STATUS.OK, "Bot deployed successfully", { bot }));
  }),

  regeneratePublicKey: asyncHandler(async (req, res) => {
    const bot = await botService.regeneratePublicKey(req.user.id, req.validated.params.id);

    return res
      .status(HTTP_STATUS.OK)
      .json(new ApiResponse(HTTP_STATUS.OK, "Public key regenerated successfully", { bot }));
  }),

  updateDeploymentAccess: asyncHandler(async (req, res) => {
    const bot = await botService.updateDeploymentAccess(
      req.user.id,
      req.validated.params.id,
      req.validated.body,
    );

    return res
      .status(HTTP_STATUS.OK)
      .json(new ApiResponse(HTTP_STATUS.OK, "Deployment access updated successfully", { bot }));
  }),

  unpublishBot: asyncHandler(async (req, res) => {
    const bot = await botService.unpublishBot(req.user.id, req.validated.params.id);

    return res
      .status(HTTP_STATUS.OK)
      .json(new ApiResponse(HTTP_STATUS.OK, "Bot unpublished successfully", { bot }));
  }),

  deleteBot: asyncHandler(async (req, res) => {
    const bot = await botService.deleteBot(req.user.id, req.validated.params.id);

    return res
      .status(HTTP_STATUS.OK)
      .json(new ApiResponse(HTTP_STATUS.OK, "Bot deleted successfully", { bot }));
  }),
};
