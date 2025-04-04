
import express from "express";
import { upload } from "../middlewares/multer.middleware";
import documentController from "../controllers/document.controller";
import authUser from "../middlewares/auth.middleware";

const router = express.Router();
// router.post('/upload',(upload.fields([
//     {
//         name:"legal docs",
//         maxCount:1
//     }
// ])),documentController.uploadDocument)
router.post('/upload',upload.single("document"),authUser,documentController.uploadDocument)
router.post('/get-documents',authUser,documentController.getAllUploadedDocument)
router.get('/get-documents/:id',authUser,documentController.getDocumentById)
router.delete('/get-documents/:id',authUser,documentController.deleteDocument)
export default router;


