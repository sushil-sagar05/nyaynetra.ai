
import express from "express";
import  {upload}  from "../middlewares/multer.middleware";
import documentController from "../controllers/document.controller";
import authUser from "../middlewares/auth.middleware";
import { limiter } from "../middlewares/rate-limit.middleware";



const router = express.Router();
router.post('/guest/upload', upload.single("document"), documentController.uploadDocument);
router.post('/upload',upload.single("document"),authUser,limiter,documentController.uploadDocument)
router.get('/get-documents',authUser,documentController.getAllUploadedDocument)
router.get('/get-documents/:id',authUser,documentController.getDocumentById)
router.delete('/get-documents/:id',authUser,documentController.deleteDocument)
export default router;


