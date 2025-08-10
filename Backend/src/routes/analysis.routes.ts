// routes
// analyze route

import express from 'express';
import analysisController from '../controllers/analysis.controller';
import authUser from '../middlewares/auth.middleware';


const router = express.Router();
router.get('/analysis/:documentId',authUser,analysisController.analysis);
router.post('/get-analyzed-document/:documentId',authUser,analysisController.getAnalysisById);
router.post('/chat-stream/:documentId', authUser, analysisController.chatWithDocumentStream);
export default router;