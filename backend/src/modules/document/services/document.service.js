import mongoose from "mongoose";
import ApiError from "../../../shared/utils/ApiError.js";
import { HTTP_STATUS } from "../../../shared/constants/httpStatus.js";
import { botRepository } from "../../bot/repositories/bot.repository.js";
import { documentRepository } from "../repositories/document.repository.js";
import { DOCUMENT_STATUS } from "../constants/document.constants.js";
import { enqueueDocumentIngestionJob } from "../../../infrastructure/jobs/ingestion.job.js";

const assertValidObjectId = (id, resourceName = "Resource") => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, `${resourceName} id is invalid`);
  }
};

export const documentService = {
  async uploadDocument({ ownerId, botId, file }) {
    assertValidObjectId(botId, "Bot");

    const bot = await botRepository.findBotByIdAndOwner(botId, ownerId);

    if (!bot) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Bot not found");
    }

    if (!file) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Document file is required");
    }

    const document = await documentRepository.createDocument({
      ownerId,
      botId,
      originalName: file.originalname,
      storedName: file.filename,
      filePath: file.path,
      mimeType: file.mimetype,
      size: file.size,
      status: DOCUMENT_STATUS.PENDING,
    });

    const job = await enqueueDocumentIngestionJob({
      documentId: document._id.toString(),
      botId: bot._id.toString(),
      filePath: file.path,
      originalName: file.originalname,
    });

    const updatedDocument = await documentRepository.updateById(document._id, {
      jobId: job.id,
    });

    return updatedDocument.toClientObject();
  },

  async getBotDocuments({ ownerId, botId }) {
    assertValidObjectId(botId, "Bot");

    const bot = await botRepository.findBotByIdAndOwner(botId, ownerId);

    if (!bot) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Bot not found");
    }

    const documents = await documentRepository.findByBotAndOwner(botId, ownerId);
    return documents.map((document) => document.toClientObject());
  },

  async getDocumentStatus({ ownerId, documentId }) {
    assertValidObjectId(documentId, "Document");

    const document = await documentRepository.findByIdAndOwner(documentId, ownerId);

    if (!document) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Document not found");
    }

    return document.toClientObject();
  },
};
