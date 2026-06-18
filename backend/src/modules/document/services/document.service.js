import mongoose from "mongoose";
import ApiError from "../../../shared/utils/ApiError.js";
import { HTTP_STATUS } from "../../../shared/constants/httpStatus.js";
import { botRepository } from "../../bot/repositories/bot.repository.js";
import { documentRepository } from "../repositories/document.repository.js";
import { DOCUMENT_STATUS } from "../constants/document.constants.js";
import { enqueueDocumentIngestionJob } from "../../../infrastructure/jobs/ingestion.job.js";
import { cloudinary } from "../../../config/cloudinary.js";
import { env } from "../../../config/env.js";
import logger from "../../../config/logger.js";

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

    logger.info("Cloudinary knowledge upload completed", {
      originalName: file.originalname,
      cloudinaryPublicId: file.filename,
      storedCloudinaryUrl: file.path,
      resourceType: "raw",
      deliveryType: "upload",
      accessMode: "public",
      fileType: file.mimetype,
      fileSize: file.size,
    });

    const document = await documentRepository.createDocument({
      ownerId,
      uploadedBy: ownerId,
      botId,
      originalName: file.originalname,
      cloudinaryPublicId: file.filename,
      cloudinaryUrl: file.path,
      fileType: file.mimetype,
      fileSize: file.size,
      processingStatus: DOCUMENT_STATUS.UPLOADED,
    });

    const job = await enqueueDocumentIngestionJob({
      documentId: document._id.toString(),
      botId: bot._id.toString(),
      fileUrl: file.path,
      originalName: file.originalname,
      sourceId: file.filename,
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

  async getMyDocuments({ ownerId }) {
    const documents = await documentRepository.findByOwner(ownerId);
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

  async deleteDocument({ ownerId, documentId }) {
    assertValidObjectId(documentId, "Document");

    const document = await documentRepository.findByIdAndOwner(documentId, ownerId);

    if (!document) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Document not found");
    }

    const ragResponse = await fetch(`${env.RAG_SERVICE_URL}/delete-source`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        botId: document.botId.toString(),
        source: document.cloudinaryPublicId || document.originalName,
      }),
    });

    if (!ragResponse.ok) {
      throw new ApiError(HTTP_STATUS.SERVICE_UNAVAILABLE, "Failed to remove document vectors");
    }

    if (document.cloudinaryPublicId) {
      await cloudinary.uploader.destroy(document.cloudinaryPublicId, {
        resource_type: "raw",
        invalidate: true,
      });
    }

    await documentRepository.deleteByIdAndOwner(documentId, ownerId);

    return document.toClientObject();
  },
};
