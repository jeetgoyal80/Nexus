import ApiError from "../../../shared/utils/ApiError.js";
import { HTTP_STATUS } from "../../../shared/constants/httpStatus.js";
import { tokenService } from "../services/token.service.js";
import { authRepository } from "../repositories/auth.repository.js";

const extractBearerToken = (authorizationHeader) => {
  if (!authorizationHeader?.startsWith("Bearer ")) {
    return null;
  }

  return authorizationHeader.split(" ")[1];
};

export const authenticate = async (req, res, next) => {
  const token = extractBearerToken(req.headers.authorization);

  if (!token) {
    return next(new ApiError(HTTP_STATUS.UNAUTHORIZED, "Access token is required"));
  }

  try {
    const payload = tokenService.verifyAccessToken(token);
    const user = await authRepository.findById(payload.sub);

    if (!user) {
      return next(new ApiError(HTTP_STATUS.UNAUTHORIZED, "Authenticated user no longer exists"));
    }

    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      provider: user.provider,
    };

    return next();
  } catch (error) {
    return next(error);
  }
};

export const optionalAuthenticate = async (req, res, next) => {
  const token = extractBearerToken(req.headers.authorization);

  if (!token) {
    return next();
  }

  try {
    const payload = tokenService.verifyAccessToken(token);
    const user = await authRepository.findById(payload.sub);

    if (!user) {
      return next(new ApiError(HTTP_STATUS.UNAUTHORIZED, "Authenticated user no longer exists"));
    }

    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      provider: user.provider,
    };

    return next();
  } catch (error) {
    return next(error);
  }
};

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(HTTP_STATUS.UNAUTHORIZED, "Authentication is required"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError(HTTP_STATUS.FORBIDDEN, "You do not have permission for this action"));
    }

    return next();
  };
};
