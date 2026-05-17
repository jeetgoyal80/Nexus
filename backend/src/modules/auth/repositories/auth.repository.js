import User from "../models/user.model.js";

export const authRepository = {
  createUser(payload) {
    return User.create(payload);
  },

  findByEmail(email, options = {}) {
    const query = User.findOne({ email: email.toLowerCase() });

    if (options.includePassword) {
      query.select("+password");
    }

    if (options.includeRefreshTokens) {
      query.select("+refreshTokens");
    }

    return query;
  },

  findById(userId, options = {}) {
    const query = User.findById(userId);

    if (options.includeRefreshTokens) {
      query.select("+refreshTokens");
    }

    return query;
  },

  findByGoogleId(googleId) {
    return User.findOne({ googleId });
  },

  findByEmailOrGoogleId(email, googleId) {
    return User.findOne({
      $or: [{ email: email.toLowerCase() }, { googleId }],
    });
  },

  async addRefreshToken(userId, refreshToken) {
    return User.findByIdAndUpdate(
      userId,
      { $push: { refreshTokens: { token: refreshToken } } },
      { new: true },
    ).select("+refreshTokens");
  },

  async replaceRefreshToken(userId, currentToken, nextToken) {
    return User.findOneAndUpdate(
      { _id: userId, "refreshTokens.token": currentToken },
      { $set: { "refreshTokens.$.token": nextToken, "refreshTokens.$.createdAt": new Date() } },
      { new: true },
    ).select("+refreshTokens");
  },

  removeRefreshToken(userId, refreshToken) {
    return User.findByIdAndUpdate(
      userId,
      { $pull: { refreshTokens: { token: refreshToken } } },
      { new: true },
    );
  },
};
