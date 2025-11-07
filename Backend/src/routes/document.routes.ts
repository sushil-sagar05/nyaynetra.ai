import express from "express";
import { upload } from "../middlewares/multer.middleware";
import documentController from "../controllers/document.controller";
import authUser from "../middlewares/auth.middleware";
import { limiter } from "../middlewares/rate-limit.middleware";
import cors, { CorsOptions } from "cors";

const router = express.Router();
const rawOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "https://nyaynetra-ai.vercel.app"
];

const allowedOrigins: string[] = rawOrigins.filter(
  (o): o is string => typeof o === "string" && o.trim().length > 0
);

const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const normalizedOrigin = origin.replace(/\/$/, "");
    const isAllowed = allowedOrigins.some((o) =>
      normalizedOrigin.startsWith(o.replace(/\/$/, ""))
    );
    if (isAllowed) callback(null, true);
    else callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "OPTIONS", "DELETE", "PUT", "PATCH"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Cache-Control",
    "Accept",
    "Origin",
    "X-Requested-With"
  ],
  optionsSuccessStatus: 200
};
router.options("/guest/upload", cors(corsOptions), (req, res) => {
  res.sendStatus(200);
});
router.post(
  "/guest/upload",
  cors(corsOptions),
  (req, res, next) => {
    console.log("📤 Guest Upload Hit!");
    console.log("Request from Origin:", req.headers.origin);
    next();
  },
  upload.single("document"),
  documentController.uploadDocument
);
router.post(
  "/upload",
  upload.single("document"),
  authUser,
  limiter,
  documentController.uploadDocument
);

router.get("/get-documents", authUser, documentController.getAllUploadedDocument);
router.get("/get-documents/:id", authUser, documentController.getDocumentById);
router.delete("/get-documents/:id", authUser, documentController.deleteDocument);

export default router;
