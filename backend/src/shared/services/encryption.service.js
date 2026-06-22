import crypto from "crypto";
import { env } from "../../config/env.js";
import ApiError from "../utils/ApiError.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;

const getKey = () => {
  if (!env.ENCRYPTION_SECRET) {
    throw new ApiError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Encryption is not configured. Set ENCRYPTION_SECRET.",
    );
  }

  return crypto.createHash("sha256").update(env.ENCRYPTION_SECRET).digest();
};

export const encryptionService = {
  encrypt(text) {
    if (!text) return null;

    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
    const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
    const authTag = cipher.getAuthTag();

    return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted.toString("hex")}`;
  },

  decrypt(payload) {
    if (!payload) return null;

    const [ivHex, authTagHex, encryptedHex] = payload.split(":");
    if (!ivHex || !authTagHex || !encryptedHex) {
      throw new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, "Encrypted secret is malformed.");
    }

    const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), Buffer.from(ivHex, "hex"));
    decipher.setAuthTag(Buffer.from(authTagHex, "hex"));

    return Buffer.concat([
      decipher.update(Buffer.from(encryptedHex, "hex")),
      decipher.final(),
    ]).toString("utf8");
  },
};
