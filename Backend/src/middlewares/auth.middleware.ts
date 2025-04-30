import UserModel,{User} from "../models/user.model";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response,NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
interface authRequest extends Request{
    user?:User
}
const authUser = async(req:authRequest,res:Response,next:NextFunction)=>{
    try {
        const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
        if(!token){
            console.log("No Token Provided")
           return next(new ApiError(400, "Unauthorized User"));
    
        }
        if(!process.env.JWT_Secret){
          return  next(new ApiError(400, "Secret is not matched"));  
        }
        const decoded = jwt.verify(token, process.env.JWT_Secret!) as JwtPayload;
        const user = await UserModel.findById(decoded._id)
        if(!user){
          return  next(new ApiError(400, "Unauthorized User"));  
        }
        req.user = user
        next();
    } catch (error:any) {
        next(new ApiError(400, error?.message || "Invalid access token"));
    }
}
export default authUser ; 