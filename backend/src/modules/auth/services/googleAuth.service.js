import ApiError from "../../../shared/utils/ApiError.js";
import { HTTP_STATUS } from "../../../shared/constants/httpStatus.js";
import { googleProvider } from "../../../providers/oauth/google.provider.js";
import { AUTH_PROVIDER } from "../constants/auth.constants.js";
import { authRepository } from "../repositories/auth.repository.js";
import { tokenService } from "./token.service.js";

export const googleAuthService = {
  async authenticateWithGoogle(idToken) {
    const googleProfile = await googleProvider.verifyIdToken(idToken);

    let user = await authRepository.findByEmailOrGoogleId(
      googleProfile.email,
      googleProfile.googleId,
    );

    if (!user) {
      user = await authRepository.createUser({
        name: googleProfile.name,
        email: googleProfile.email,
        provider: AUTH_PROVIDER.GOOGLE,
        googleId: googleProfile.googleId,
      });
    }

    if (user.provider !== AUTH_PROVIDER.GOOGLE || user.googleId !== googleProfile.googleId) {
      throw new ApiError(
        HTTP_STATUS.CONFLICT,
        "An account already exists with this email using a different auth provider",
      );
    }

    const tokens = tokenService.generateTokenPair(user);
    await authRepository.addRefreshToken(user._id, tokens.refreshToken);

    return {
      user: user.toSafeObject(),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  },
};
