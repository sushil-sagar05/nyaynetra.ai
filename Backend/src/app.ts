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

const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    console.log("🔍 CORS Debug - Incoming Origin:", origin);
    console.log("📋 Allowed Origins:", allowedOrigins);
    console.log("🏠 Environment FRONTEND_URL:", process.env.FRONTEND_URL);

    if (!origin) {
      return callback(null, true);
    }

    const normalizedOrigin = origin.replace(/\/$/, "");
    const isAllowed = allowedOrigins.some((o) =>
      normalizedOrigin.startsWith(o.replace(/\/$/, ""))
    );

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
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

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use((req, res, next) => {
  const originalSend = res.send;
  res.send = function (data) {
    console.log("Response Headers being sent:");
    console.log("Access-Control-Allow-Origin:", res.getHeader("Access-Control-Allow-Origin"));
    console.log("Access-Control-Allow-Credentials:", res.getHeader("Access-Control-Allow-Credentials"));
    return originalSend.call(this, data);
  };
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log("Frontend URL allowed by CORS:", process.env.FRONTEND_URL);

app.get("/", (req, res) => {
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

app.use("/user", userRoutes);
app.use("/document", documentRoutes);
app.use("/settings", settingRoutes);
app.use("/analyze", analysisRoutes);

import errors from "./globalError";
app.use(errors.MulterError);
app.use(errors.ApiErrors);

module.exports = app;
