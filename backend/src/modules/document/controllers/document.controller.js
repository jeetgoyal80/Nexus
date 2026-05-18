import { documentService } from "../services/document.service.js";
import asyncHandler from "../../../shared/utils/asyncHandler.js";
import ApiResponse from "../../../shared/utils/ApiResponse.js";
import { HTTP_STATUS } from "../../../shared/constants/httpStatus.js";

export const documentController = {
  uploadDocument: asyncHandler(async (req, res) => {
    const document = await documentService.uploadDocument({
      ownerId: req.user.id,
      botId: req.validated.params.botId,
      file: req.file,
    });

    return res
      .status(HTTP_STATUS.ACCEPTED)
      .json(new ApiResponse(HTTP_STATUS.ACCEPTED, "Document upload accepted for processing", { document }));
  }),

  getBotDocuments: asyncHandler(async (req, res) => {
    const documents = await documentService.getBotDocuments({
      ownerId: req.user.id,
      botId: req.validated.params.botId,
    });

    return res
      .status(HTTP_STATUS.OK)
      .json(new ApiResponse(HTTP_STATUS.OK, "Documents fetched successfully", { documents }));
  }),

  getDocumentStatus: asyncHandler(async (req, res) => {
    const document = await documentService.getDocumentStatus({
      ownerId: req.user.id,
      documentId: req.validated.params.id,
    });

    return res
      .status(HTTP_STATUS.OK)
      .json(new ApiResponse(HTTP_STATUS.OK, "Document status fetched successfully", { document }));
  }),
};
