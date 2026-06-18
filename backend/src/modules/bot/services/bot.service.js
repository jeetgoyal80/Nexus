import mongoose from "mongoose";
import crypto from "crypto";
import ApiError from "../../../shared/utils/ApiError.js";
import { HTTP_STATUS } from "../../../shared/constants/httpStatus.js";
import { botRepository } from "../repositories/bot.repository.js";
import {
  BOT_DEPLOYMENT_STATUS,
  BOT_VISIBILITY,
} from "../constants/bot.constants.js";

const assertValidObjectId = (id, resourceName = "Resource") => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, `${resourceName} id is invalid`);
  }
};

const sanitizeUpdatePayload = (payload) => {
  const allowedFields = [
    "name",
    "description",
    "role",
    "tone",
    "instructions",
    "strictKnowledgeMode",
    "outputFormat",
    "theme",
    "welcomeMessage",
    "avatar",
    "visibility",
    "deploymentMode",
    "sdkEnabled",
    "apiEnabled",
    "appearanceConfig",
  ];

  return allowedFields.reduce((update, field) => {
    if (payload[field] !== undefined) {
      update[field] = payload[field];
    }

    return update;
  }, {});
};

const generatePublicKey = () => `pk_test_${crypto.randomBytes(24).toString("hex")}`;

const generatePublicSlug = (bot) => {
  const base =
    bot.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 80) || "bot";

  return `${base}-${bot._id.toString().slice(-8)}`;
};

export const botService = {
  async createBot(ownerId, payload) {
    const bot = await botRepository.createBot({
      ...payload,
      ownerId,
    });

    return bot.toClientObject();
  },

  async getMyBots(ownerId) {
    const bots = await botRepository.getBotsByOwner(ownerId);
    return bots.map((bot) => bot.toClientObject());
  },

  async getBotById(ownerId, botId) {
    assertValidObjectId(botId, "Bot");

    const bot = await botRepository.findBotByIdAndOwner(botId, ownerId);

    if (!bot) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Bot not found");
    }

    return bot.toClientObject();
  },

  async updateBot(ownerId, botId, payload) {
    assertValidObjectId(botId, "Bot");

    const updatePayload = sanitizeUpdatePayload(payload);
    const bot = await botRepository.updateBotByIdAndOwner(botId, ownerId, updatePayload);

    if (!bot) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Bot not found");
    }

    return bot.toClientObject();
  },

  async deployBot(ownerId, botId) {
    assertValidObjectId(botId, "Bot");

    const bot = await botRepository.findBotByIdAndOwner(botId, ownerId);

    if (!bot) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Bot not found");
    }

    const publicKey = bot.publicKey || generatePublicKey();
    const publicSlug = bot.publicSlug || generatePublicSlug(bot);

    const deployedBot = await botRepository.updateBotByIdAndOwner(botId, ownerId, {
      visibility: BOT_VISIBILITY.PUBLIC,
      deploymentStatus: BOT_DEPLOYMENT_STATUS.DEPLOYED,
      publicKey,
      publicSlug,
      sdkEnabled: true,
      apiEnabled: true,
      deployedAt: new Date(),
    });

    return deployedBot.toClientObject();
  },

  async regeneratePublicKey(ownerId, botId) {
    assertValidObjectId(botId, "Bot");

    const bot = await botRepository.updateBotByIdAndOwner(botId, ownerId, {
      publicKey: generatePublicKey(),
    });

    if (!bot) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Bot not found");
    }

    return bot.toClientObject();
  },

  async updateDeploymentAccess(ownerId, botId, payload) {
    assertValidObjectId(botId, "Bot");

    const updatePayload = {};

    if (payload.sdkEnabled !== undefined) {
      updatePayload.sdkEnabled = payload.sdkEnabled;
    }

    if (payload.apiEnabled !== undefined) {
      updatePayload.apiEnabled = payload.apiEnabled;
    }

    if (payload.deploymentMode !== undefined) {
      updatePayload.deploymentMode = payload.deploymentMode;
      updatePayload["appearanceConfig.deploymentMode"] = payload.deploymentMode;
    }

    const bot = await botRepository.updateBotByIdAndOwner(botId, ownerId, updatePayload);

    if (!bot) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Bot not found");
    }

    return bot.toClientObject();
  },

  async unpublishBot(ownerId, botId) {
    assertValidObjectId(botId, "Bot");

    const bot = await botRepository.updateBotByIdAndOwner(botId, ownerId, {
      visibility: BOT_VISIBILITY.PRIVATE,
      deploymentStatus: BOT_DEPLOYMENT_STATUS.DRAFT,
      sdkEnabled: false,
      apiEnabled: false,
      deployedAt: null,
    });

    if (!bot) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Bot not found");
    }

    return bot.toClientObject();
  },

  async deleteBot(ownerId, botId) {
    assertValidObjectId(botId, "Bot");

    const bot = await botRepository.deleteBotByIdAndOwner(botId, ownerId);

    if (!bot) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Bot not found");
    }

    return bot.toClientObject();
  },
};
