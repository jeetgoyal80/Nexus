import { OAuth2Client } from "google-auth-library";
import { env } from "../../config/env.js";
import ApiError from "../../shared/utils/ApiError.js";
import { HTTP_STATUS } from "../../shared/constants/httpStatus.js";

const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);

export const googleProvider = {
  async verifyIdToken(idToken) {
    if (!env.GOOGLE_CLIENT_ID) {
      throw new ApiError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Google OAuth is not configured. Set GOOGLE_CLIENT_ID in environment variables.",
      );
    }

    try {
      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();

      if (!payload?.email || !payload?.sub) {
        throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid Google identity token");
      }

      if (!payload.email_verified) {
        throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Google email is not verified");
      }

      return {
        googleId: payload.sub,
        email: payload.email,
        name: payload.name || payload.email.split("@")[0],
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid Google identity token");
    }
  },
};
