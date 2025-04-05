import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import multer from 'multer';

const errorHandler: ErrorRequestHandler = (err, req: Request, res: Response, next: NextFunction): void => {
  if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
    res.status(400).json({ error: 'File size exceeds the limit of 10MB' });
    return; 
  }
  next(err);  
};

export default errorHandler;
