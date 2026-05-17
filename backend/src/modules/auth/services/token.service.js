import { env } from "../../../config/env.js";
import { signJwt, verifyJwt } from "../../../shared/utils/jwt.js";

export const tokenService = {
  generateAccessToken(user) {
    return signJwt(
      {
        sub: user._id.toString(),
        role: user.role,
      },
      env.JWT_ACCESS_SECRET,
      env.ACCESS_TOKEN_EXPIRES,
    );
  },

  generateRefreshToken(user) {
    return signJwt(
      {
        sub: user._id.toString(),
        tokenType: "refresh",
      },
      env.JWT_REFRESH_SECRET,
      env.REFRESH_TOKEN_EXPIRES,
    );
  },

  generateTokenPair(user) {
    return {
      accessToken: this.generateAccessToken(user),
      refreshToken: this.generateRefreshToken(user),
    };
  },

  verifyAccessToken(token) {
    return verifyJwt(token, env.JWT_ACCESS_SECRET);
  },

  verifyRefreshToken(token) {
    return verifyJwt(token, env.JWT_REFRESH_SECRET);
  },
};
