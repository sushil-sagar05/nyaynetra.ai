import express from "express";
import dotenv from "dotenv";
import cors, { CorsOptions } from "cors";
import cookieParser from "cookie-parser";
const connect = require("./DB/db");

dotenv.config({ path: ".env" });
connect();

const app = express();
app.set("trust proxy", 1);
app.use(cookieParser());

const rawOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "https://nyaynetra-ai.vercel.app"
];

const allowedOrigins: string[] = rawOrigins.filter(
  (o): o is string => typeof o === "string" && o.trim().length > 0
);

const authCors: CorsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "OPTIONS", "PUT", "PATCH", "DELETE"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Cache-Control",
    "Accept",
    "Origin",
    "X-Requested-With"
  ],
};

const guestCors: CorsOptions = {
  origin: "*",
  credentials: false,
  methods: ["GET", "POST", "OPTIONS"],
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", cors(guestCors), (req, res) => {
  res.send("Hello World");
});

import {
  ScheduledDeletion,
  DeleteDeactivateUser,
  ScheduledDeletionforMulter
} from "./cron/Schedule-deletion";

ScheduledDeletion();
DeleteDeactivateUser();
ScheduledDeletionforMulter();

import userRoutes from "./routes/user.routes";
import documentRoutes from "./routes/document.routes";
import settingRoutes from "./routes/settings.route";
import analysisRoutes from "./routes/analysis.routes";
import guestAnalysisRoutes from "./routes/guest.route";
app.use("/user", cors(authCors), userRoutes);
app.use("/document", cors(authCors), documentRoutes);
app.use("/settings", cors(authCors), settingRoutes);
app.use("/analyze", cors(authCors), analysisRoutes);
app.use("/guest/document", cors(guestCors), documentRoutes);
app.use("/guest/analyze", cors(guestCors), guestAnalysisRoutes);

import errors from "./globalError";
app.use(errors.MulterError);
app.use(errors.ApiErrors);

module.exports = app;
