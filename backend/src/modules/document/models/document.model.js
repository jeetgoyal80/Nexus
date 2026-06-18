import mongoose from "mongoose";
import { DOCUMENT_STATUS } from "../constants/document.constants.js";

const documentSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
      default: null,
    },
    botId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bot",
      required: true,
      index: true,
    },
    originalName: {
      type: String,
      required: true,
      trim: true,
    },
    cloudinaryPublicId: {
      type: String,
      trim: true,
      default: null,
    },
    cloudinaryUrl: {
      type: String,
      default: null,
    },
    fileType: {
      type: String,
      default: null,
    },
    fileSize: {
      type: Number,
      default: null,
    },
    storedName: {
      type: String,
      trim: true,
      default: null,
    },
    filePath: {
      type: String,
      default: null,
    },
    mimeType: {
      type: String,
      default: null,
    },
    size: {
      type: Number,
      default: null,
    },
    status: {
      type: String,
      default: null,
    },
    processingStatus: {
      type: String,
      enum: Object.values(DOCUMENT_STATUS),
      default: DOCUMENT_STATUS.UPLOADED,
      index: true,
    },
    jobId: {
      type: String,
      default: null,
      index: true,
    },
    chunksCreated: {
      type: Number,
      default: 0,
    },
    vectorsStored: {
      type: Number,
      default: 0,
    },
    errorMessage: {
      type: String,
      default: null,
    },
    processingStartedAt: {
      type: Date,
      default: null,
    },
    processingCompletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

documentSchema.index({ ownerId: 1, botId: 1, createdAt: -1 });

documentSchema.methods.toClientObject = function toClientObject() {
  const processingStatus =
    this.status === "FAILED"
      ? DOCUMENT_STATUS.FAILED
      : this.status === "PROCESSING"
        ? DOCUMENT_STATUS.PROCESSING
        : this.status === "COMPLETED"
          ? DOCUMENT_STATUS.EMBEDDED
          : this.processingStatus ||
            (this.vectorsStored > 0 ? DOCUMENT_STATUS.EMBEDDED : DOCUMENT_STATUS.UPLOADED);

  return {
    id: this._id.toString(),
    botId: this.botId.toString(),
    originalName: this.originalName,
    cloudinaryUrl: this.cloudinaryUrl,
    mimeType: this.fileType || this.mimeType,
    size: this.fileSize ?? this.size ?? 0,
    processingStatus,
    status: processingStatus,
    uploadDate: this.createdAt,
    jobId: this.jobId,
    chunksCreated: this.chunksCreated,
    vectorsStored: this.vectorsStored,
    errorMessage: this.errorMessage,
    processingStartedAt: this.processingStartedAt,
    processingCompletedAt: this.processingCompletedAt,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

const Document = mongoose.model("Document", documentSchema);

export default Document;
