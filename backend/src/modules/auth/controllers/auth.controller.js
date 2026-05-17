import { authService } from "../services/auth.service.js";
import { googleAuthService } from "../services/googleAuth.service.js";
import asyncHandler from "../../../shared/utils/asyncHandler.js";
import ApiResponse from "../../../shared/utils/ApiResponse.js";
import { HTTP_STATUS } from "../../../shared/constants/httpStatus.js";
import {
  clearRefreshTokenCookie,
  REFRESH_TOKEN_COOKIE_NAME,
  setRefreshTokenCookie,
} from "../../../shared/utils/cookies.js";

export const authController = {
  signup: asyncHandler(async (req, res) => {
    const result = await authService.signup(req.validated.body);

    setRefreshTokenCookie(res, result.refreshToken);

    return res
      .status(HTTP_STATUS.CREATED)
      .json(new ApiResponse(HTTP_STATUS.CREATED, "Signup successful", {
        user: result.user,
        accessToken: result.accessToken,
      }));
  }),

  login: asyncHandler(async (req, res) => {
    const result = await authService.login(req.validated.body);

    setRefreshTokenCookie(res, result.refreshToken);

    return res
      .status(HTTP_STATUS.OK)
      .json(new ApiResponse(HTTP_STATUS.OK, "Login successful", {
        user: result.user,
        accessToken: result.accessToken,
      }));
  }),

  googleLogin: asyncHandler(async (req, res) => {
    const result = await googleAuthService.authenticateWithGoogle(req.validated.body.idToken);

    setRefreshTokenCookie(res, result.refreshToken);

    return res
      .status(HTTP_STATUS.OK)
      .json(new ApiResponse(HTTP_STATUS.OK, "Google login successful", {
        user: result.user,
        accessToken: result.accessToken,
      }));
  }),

  refresh: asyncHandler(async (req, res) => {
    const result = await authService.refresh(req.cookies[REFRESH_TOKEN_COOKIE_NAME]);

    setRefreshTokenCookie(res, result.refreshToken);

    return res
      .status(HTTP_STATUS.OK)
      .json(new ApiResponse(HTTP_STATUS.OK, "Token refreshed", {
        user: result.user,
        accessToken: result.accessToken,
      }));
  }),

  logout: asyncHandler(async (req, res) => {
    await authService.logout(req.cookies[REFRESH_TOKEN_COOKIE_NAME]);
    clearRefreshTokenCookie(res);

    return res
      .status(HTTP_STATUS.OK)
      .json(new ApiResponse(HTTP_STATUS.OK, "Logout successful"));
  }),

  me: asyncHandler(async (req, res) => {
    const user = await authService.getCurrentUser(req.user.id);

    return res
      .status(HTTP_STATUS.OK)
      .json(new ApiResponse(HTTP_STATUS.OK, "Current user fetched", { user }));
  }),
};
