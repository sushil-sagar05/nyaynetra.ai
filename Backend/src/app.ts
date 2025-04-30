import express, { Response } from "express";
const connect = require('./DB/db');
const dotenv = require("dotenv");
dotenv.config({
    path: '.env'
});
connect();
const cors = require('cors');
import cookieparser from 'cookie-parser';
const app = express();
app.use(cookieparser());

app.set("trust proxy", 1);

const corsOptions = {
  origin: process.env.FRONTEND_URL, 
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req,res)=>{
  res.send('Hello World');
});
import { ScheduledDeletion } from './cron/Schedule-deletion';
import { DeleteDeactivateUser } from "./cron/Schedule-deletion";
import { ScheduledDeletionforMulter } from "./cron/Schedule-deletion";

ScheduledDeletion();
DeleteDeactivateUser();
ScheduledDeletionforMulter();

import userRoutes from './routes/user.routes';
import documentRoutes from './routes/document.routes';
import settingRoutes from './routes/settings.route';

app.use('/user', userRoutes);
app.use('/document', documentRoutes);
app.use('/settings', settingRoutes);

import errors from "./globalError";
app.use(errors.MulterError);
app.use(errors.ApiErrors);

module.exports = app;
