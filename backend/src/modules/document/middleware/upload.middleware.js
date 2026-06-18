import path from "path";
import { randomUUID } from "crypto";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinary } from "../../../config/cloudinary.js";
import ApiError from "../../../shared/utils/ApiError.js";
import { HTTP_STATUS } from "../../../shared/constants/httpStatus.js";
import { ALLOWED_DOCUMENT_MIME_TYPES } from "../constants/document.constants.js";

const sanitizeFilename = (filename) => {
  const extension = path.extname(filename).toLowerCase();
  const basename = path.basename(filename, extension).replace(/[^a-zA-Z0-9_-]/g, "_");
  return `${basename || "document"}${extension}`;
};

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "chatbot-knowledge",
    resource_type: "raw",
    type: "upload",
    access_mode: "public",
    public_id: `${Date.now()}-${randomUUID()}-${sanitizeFilename(file.originalname)}`,
  }),
});

const fileFilter = (req, file, cb) => {
  if (ALLOWED_DOCUMENT_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
    return;
  }

  cb(new ApiError(HTTP_STATUS.BAD_REQUEST, "Unsupported document type"));
};

export const uploadDocument = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 25 * 1024 * 1024,
    files: 1,
  },
});
