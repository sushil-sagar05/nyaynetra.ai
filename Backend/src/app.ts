import express, { Response } from "express";
const connect = require('./DB/db');
const dotenv = require("dotenv");
dotenv.config({
    path: '.env'
});
connect();
const cors = require('cors');
const app = express();
import cookieparser from 'cookie-parser';
import { CorsOptions } from "cors";

app.set("trust proxy", 1);

const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        const allowedOrigin = process.env.FRONTEND_URL;

        if (origin === allowedOrigin || !origin) {
            callback(null, true);  
        } else {
            callback(new Error('Not allowed by CORS'), false);  
        }
    },
    credentials: true, 
    methods: ['GET', 'POST', 'OPTIONS', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

app.use(cookieparser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import { ScheduledDeletion } from './cron/Schedule-deletion';
import { DeleteDeactivateUser } from "./cron/Schedule-deletion";
import { ScheduledDeletionforMulter } from "./cron/Schedule-deletion";

ScheduledDeletion();
DeleteDeactivateUser();
ScheduledDeletionforMulter();

app.get('/', ( res: Response) => {
    res.send('Hello World');
});

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
