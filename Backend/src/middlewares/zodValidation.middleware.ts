import { NextFunction,Request,Response } from "express";
import { ZodSchema,ZodError } from "zod";

export const validationSchema = (schema:ZodSchema<any>)=>{
   return (req:Request,res:Response,next:NextFunction)=>{
        try {
           const result = schema.safeParse(req.body);
           if(!result.success){
             res.status(400).json({ error: result.error.errors });
             return;
           }
           req.body = result.data
            return next();
        } catch (error) {
            if (error instanceof ZodError) { 
                res.status(400).json({ error: error.errors });  
                return;
              }
             res.status(400).json({ message: "Something went wrong" });
             return;
        }
    };
};