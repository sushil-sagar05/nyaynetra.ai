import express, { Request, Response } from "express";
const connect = require('./DB/db')
const dotenv = require("dotenv")
dotenv.config({
    path:'.env'
})
connect();
const cors = require('cors')
const app = express()
import cookieparser from 'cookie-parser'
import { CorsOptions } from "cors";
const corsOptions:CorsOptions = {
    origin: (origin, callback) => {
  
      const allowedOrigin = process.env.FRONTEND_URL;

      if (origin === allowedOrigin || !origin) {
        callback(null, true);  
      } else {
  
        callback(new Error('Not allowed by CORS'), false);  
      }
    },
    credentials: true, 
    methods: ['GET', 'POST', 'OPTIONS','DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };
  app.use(cors(corsOptions));
  app.use(cookieparser());
  app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/', (req:Request,res:Response)=>{
    res.send('Hello World');
});
import userRoutes from './routes/user.routes'
import documentRoutes from './routes/document.routes'
app.use('/user',userRoutes);
app.use('/document',documentRoutes)
module.exports = app;