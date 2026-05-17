import Chat from "../models/chat.model.js";

export const chatRepository = {
  findConversation({ botId, conversationId, userId, sessionId }) {
    const query = { _id: conversationId, botId };

    if (userId) {
      query.userId = userId;
    } else {
      query.sessionId = sessionId;
      query.userId = null;
    }

    return Chat.findOne(query);
  },

  createConversation(payload) {
    return Chat.create(payload);
  },

  appendMessages(conversationId, messages) {
    return Chat.findByIdAndUpdate(
      conversationId,
      {
        $push: { messages: { $each: messages } },
        $set: { lastMessageAt: new Date() },
      },
      { new: true },
    );
  },
};
