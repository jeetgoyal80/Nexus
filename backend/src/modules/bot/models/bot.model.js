import mongoose from "mongoose";
import {
  BOT_OUTPUT_FORMAT,
  BOT_TONE,
  BOT_VISIBILITY,
} from "../constants/bot.constants.js";

const botSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
    role: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    tone: {
      type: String,
      enum: Object.values(BOT_TONE),
      default: BOT_TONE.PROFESSIONAL,
    },
    instructions: {
      type: String,
      trim: true,
      maxlength: 4000,
      default: "",
    },
    outputFormat: {
      type: String,
      enum: Object.values(BOT_OUTPUT_FORMAT),
      default: BOT_OUTPUT_FORMAT.PARAGRAPH,
    },
    theme: {
      type: String,
      trim: true,
      maxlength: 40,
      default: "light",
    },
    welcomeMessage: {
      type: String,
      trim: true,
      maxlength: 300,
      default: "Hi, how can I help you today?",
    },
    avatar: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
    visibility: {
      type: String,
      enum: Object.values(BOT_VISIBILITY),
      default: BOT_VISIBILITY.PRIVATE,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

botSchema.index({ ownerId: 1, createdAt: -1 });
botSchema.index({ ownerId: 1, name: 1 });

botSchema.methods.toClientObject = function toClientObject() {
  return {
    id: this._id.toString(),
    ownerId: this.ownerId.toString(),
    name: this.name,
    description: this.description,
    role: this.role,
    tone: this.tone,
    instructions: this.instructions,
    outputFormat: this.outputFormat,
    theme: this.theme,
    welcomeMessage: this.welcomeMessage,
    avatar: this.avatar,
    visibility: this.visibility,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

botSchema.methods.toPublicRuntimeObject = function toPublicRuntimeObject() {
  return {
    id: this._id.toString(),
    name: this.name,
    description: this.description,
    theme: this.theme,
    welcomeMessage: this.welcomeMessage,
    avatar: this.avatar,
    visibility: this.visibility,
  };
};

const Bot = mongoose.model("Bot", botSchema);

export default Bot;
