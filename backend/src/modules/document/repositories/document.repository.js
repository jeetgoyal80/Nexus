import Document from "../models/document.model.js";

export const documentRepository = {
  createDocument(payload) {
    return Document.create(payload);
  },

  findByIdAndOwner(documentId, ownerId) {
    return Document.findOne({ _id: documentId, ownerId });
  },

  findByBotAndOwner(botId, ownerId) {
    return Document.find({ botId, ownerId }).sort({ createdAt: -1 });
  },

  updateById(documentId, payload) {
    return Document.findByIdAndUpdate(documentId, { $set: payload }, { new: true });
  },
};
