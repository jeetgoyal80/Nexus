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
    storedName: {
      type: String,
      required: true,
      trim: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(DOCUMENT_STATUS),
      default: DOCUMENT_STATUS.PENDING,
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
  return {
    id: this._id.toString(),
    botId: this.botId.toString(),
    originalName: this.originalName,
    mimeType: this.mimeType,
    size: this.size,
    status: this.status,
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
