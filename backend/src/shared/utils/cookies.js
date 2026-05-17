import { env } from "../../config/env.js";

export const REFRESH_TOKEN_COOKIE_NAME = "refreshToken";

const refreshTokenMaxAgeMs = 7 * 24 * 60 * 60 * 1000;

export const refreshTokenCookieOptions = {
  httpOnly: true,
  secure: env.isProduction,
  sameSite: env.isProduction ? "none" : "lax",
  maxAge: refreshTokenMaxAgeMs,
  path: "/api/auth",
  ...(env.COOKIE_DOMAIN ? { domain: env.COOKIE_DOMAIN } : {}),
};

export const setRefreshTokenCookie = (res, refreshToken) => {
  res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, refreshTokenCookieOptions);
};

export const clearRefreshTokenCookie = (res) => {
  res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, {
    ...refreshTokenCookieOptions,
    maxAge: undefined,
  });
};
