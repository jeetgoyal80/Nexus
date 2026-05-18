import { Router } from "express";
import { authenticate } from "../../auth/middleware/auth.middleware.js";
import { documentController } from "../controllers/document.controller.js";
import { uploadDocument } from "../middleware/upload.middleware.js";
import { botIdParamSchema, documentIdParamSchema, validate } from "../validators/document.validation.js";

const router = Router();

router.use(authenticate);

router.post(
  "/bots/:botId/documents",
  validate(botIdParamSchema),
  uploadDocument.single("file"),
  documentController.uploadDocument,
);

router.get("/bots/:botId/documents", validate(botIdParamSchema), documentController.getBotDocuments);
router.get("/documents/:id", validate(documentIdParamSchema), documentController.getDocumentStatus);

export default router;
