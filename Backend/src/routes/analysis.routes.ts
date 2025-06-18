// routes
// analyze route

import express from 'express';
import analysisController from '../controllers/analysis.controller';
import authUser from '../middlewares/auth.middleware';


const router = express.Router();
router.post('/analysis/:documentId',authUser,analysisController.analysis);
router.post('/get-analyzed-document/:documentId',authUser,analysisController.getAnalysisById);
export default router;