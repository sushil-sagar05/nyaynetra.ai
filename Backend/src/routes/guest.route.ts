import express from "express";
import analysisController from "../controllers/analysis.controller";

const router = express.Router();

router.get("/analysis/:documentId", analysisController.guestAnalysis);
export default router;
