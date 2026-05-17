import ApiError from "../../../shared/utils/ApiError.js";
import { HTTP_STATUS } from "../../../shared/constants/httpStatus.js";
import { AUTH_PROVIDER } from "../constants/auth.constants.js";
import { authRepository } from "../repositories/auth.repository.js";
import { tokenService } from "./token.service.js";

const sanitizeAuthPayload = (user, accessToken) => ({
  user: user.toSafeObject(),
  accessToken,
});

export const authService = {
  async signup(payload) {
    const existingUser = await authRepository.findByEmail(payload.email);

    if (existingUser) {
      throw new ApiError(HTTP_STATUS.CONFLICT, "An account with this email already exists");
    }

    const user = await authRepository.createUser({
      name: payload.name,
      email: payload.email,
      password: payload.password,
      provider: AUTH_PROVIDER.LOCAL,
    });

    const tokens = tokenService.generateTokenPair(user);
    await authRepository.addRefreshToken(user._id, tokens.refreshToken);

    return {
      ...sanitizeAuthPayload(user, tokens.accessToken),
      refreshToken: tokens.refreshToken,
    };
  },

  async login(payload) {
    const user = await authRepository.findByEmail(payload.email, { includePassword: true });

    if (!user || user.provider !== AUTH_PROVIDER.LOCAL) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid email or password");
    }

    const isPasswordValid = await user.comparePassword(payload.password);

    if (!isPasswordValid) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid email or password");
    }

    const tokens = tokenService.generateTokenPair(user);
    await authRepository.addRefreshToken(user._id, tokens.refreshToken);

    return {
      ...sanitizeAuthPayload(user, tokens.accessToken),
      refreshToken: tokens.refreshToken,
    };
  },

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Refresh token is required");
    }

    const payload = tokenService.verifyRefreshToken(refreshToken);

    if (payload.tokenType !== "refresh") {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid refresh token");
    }

    const user = await authRepository.findById(payload.sub, { includeRefreshTokens: true });

    if (!user) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "User no longer exists");
    }

    const tokenExists = user.refreshTokens.some((entry) => entry.token === refreshToken);

    if (!tokenExists) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Refresh token has been revoked");
    }

    const tokens = tokenService.generateTokenPair(user);
    await authRepository.replaceRefreshToken(user._id, refreshToken, tokens.refreshToken);

    return {
      ...sanitizeAuthPayload(user, tokens.accessToken),
      refreshToken: tokens.refreshToken,
    };
  },

  async logout(refreshToken) {
    if (!refreshToken) {
      return;
    }

    const payload = tokenService.verifyRefreshToken(refreshToken);
    await authRepository.removeRefreshToken(payload.sub, refreshToken);
  },

  async getCurrentUser(userId) {
    const user = await authRepository.findById(userId);

    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found");
    }

    return user.toSafeObject();
  },
};
