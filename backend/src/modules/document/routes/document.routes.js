import { Router } from "express";
import { authenticate } from "../../auth/middleware/auth.middleware.js";
import { documentController } from "../controllers/document.controller.js";
import { uploadDocument } from "../middleware/upload.middleware.js";
import { botIdParamSchema, documentIdParamSchema, validate } from "../validators/document.validation.js";

const router = Router();

router.post(
  "/bots/:botId/documents",
  authenticate,
  validate(botIdParamSchema),
  uploadDocument.single("file"),
  documentController.uploadDocument,
);
router.post(
  "/knowledge/upload/:botId",
  authenticate,
  validate(botIdParamSchema),
  uploadDocument.single("file"),
  documentController.uploadDocument,
);
router.post(
  "/knowledge/upload",
  authenticate,
  uploadDocument.single("file"),
  documentController.uploadDocument,
);

router.get(
  "/bots/:botId/documents",
  authenticate,
  validate(botIdParamSchema),
  documentController.getBotDocuments,
);
router.get("/knowledge", authenticate, documentController.getMyDocuments);
router.get(
  "/documents/:id",
  authenticate,
  validate(documentIdParamSchema),
  documentController.getDocumentStatus,
);
router.delete(
  "/knowledge/:id",
  authenticate,
  validate(documentIdParamSchema),
  documentController.deleteDocument,
);

export default router;
