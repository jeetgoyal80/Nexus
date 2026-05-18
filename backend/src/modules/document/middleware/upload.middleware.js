import fs from "fs";
import path from "path";
import multer from "multer";
import { env } from "../../../config/env.js";
import ApiError from "../../../shared/utils/ApiError.js";
import { HTTP_STATUS } from "../../../shared/constants/httpStatus.js";
import { ALLOWED_DOCUMENT_MIME_TYPES } from "../constants/document.constants.js";

const uploadDir = path.resolve(env.UPLOAD_DIR);
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${Date.now()}-${cryptoRandom()}-${safeName}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (ALLOWED_DOCUMENT_MIME_TYPES.includes(file.mimetype)) {
    return cb(null, true);
  }

  return cb(new ApiError(HTTP_STATUS.BAD_REQUEST, "Unsupported document type"));
};

const cryptoRandom = () => Math.random().toString(36).slice(2, 10);

export const uploadDocument = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 25 * 1024 * 1024,
  },
});
