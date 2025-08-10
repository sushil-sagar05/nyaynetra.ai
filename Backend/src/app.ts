import express from "express";
import dotenv from "dotenv";
import cors, { CorsOptions } from "cors";
import cookieParser from "cookie-parser";
const connect = require('./DB/db');

dotenv.config({ path: '.env' });
connect();

const app = express();

app.set("trust proxy", 1);

app.use(cookieParser());

const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'http://localhost:3000',
      undefined
    ];
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS', 'DELETE', 'PUT', 'PATCH'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'Cache-Control',
    'Accept',
    'Origin',
    'X-Requested-With'
  ],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log("Frontend URL allowed by CORS:", process.env.FRONTEND_URL);

app.get('/', (req, res) => {
  res.send('Hello World');
});

import { ScheduledDeletion, DeleteDeactivateUser, ScheduledDeletionforMulter } from './cron/Schedule-deletion';
ScheduledDeletion();
DeleteDeactivateUser();
ScheduledDeletionforMulter();

import userRoutes from './routes/user.routes';
import documentRoutes from './routes/document.routes';
import settingRoutes from './routes/settings.route';
import analysisRoutes from './routes/analysis.routes'

app.use('/user', userRoutes);
app.use('/document', documentRoutes);
app.use('/settings', settingRoutes);
app.use('/analyze',analysisRoutes)

import errors from "./globalError";
app.use(errors.MulterError);
app.use(errors.ApiErrors);

module.exports = app;
