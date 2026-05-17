import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    metadata: {
      type: Object,
      default: {},
    },
  },
  { _id: false },
);

const chatSchema = new mongoose.Schema(
  {
    botId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bot",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    sessionId: {
      type: String,
      trim: true,
      index: true,
      default: null,
    },
    messages: {
      type: [messageSchema],
      default: [],
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

chatSchema.index({ botId: 1, userId: 1, updatedAt: -1 });
chatSchema.index({ botId: 1, sessionId: 1, updatedAt: -1 });

chatSchema.methods.toClientObject = function toClientObject() {
  return {
    id: this._id.toString(),
    botId: this.botId.toString(),
    userId: this.userId?.toString() || null,
    sessionId: this.sessionId,
    messages: this.messages,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
