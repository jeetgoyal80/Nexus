import jwt from "jsonwebtoken";
import ApiError from "./ApiError.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";

export const signJwt = (payload, secret, expiresIn) => {
  return jwt.sign(payload, secret, { expiresIn });
};

export const verifyJwt = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid or expired token");
  }
};
