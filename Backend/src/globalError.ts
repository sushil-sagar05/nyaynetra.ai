import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import multer from 'multer';
import { ApiError } from './utils/ApiError';

const MulterError: ErrorRequestHandler = (err, req: Request, res: Response, next: NextFunction): void => {
  if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
    res.status(400).json({ error: 'File size exceeds the limit of 10MB' });
    return; 
  }
  next(err);  
};
const ApiErrors:ErrorRequestHandler =(err: any, req: Request, res: Response, next: NextFunction):void => {
  if (err instanceof ApiError) {
      console.error("Caught ApiError: ", err);  
      res.status(err.statusCode).json({
          success: false,
          message: err.message,
        });
        return
  }

  console.error("Unexpected Error: ", err);
  res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
    return
};
const errors = {
 MulterError,
  ApiErrors
}
export default errors


