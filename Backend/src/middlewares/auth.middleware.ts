import UserModel,{User} from "../models/user.model";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response,NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
interface authRequest extends Request{
    user?:User
}
const authUser = async(req:authRequest,res:Response,next:NextFunction)=>{
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
    if(!token){
        console.log("No Token Provided")
        throw new ApiError(400,"Unauthorized User")

    }
    try {
        if(!process.env.JWT_Secret){
          throw new ApiError(400,"Secret is not matched")  
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        const user = await UserModel.findById(decoded._id)
        if(!user){
            throw new ApiError(400,"Unauthorized User")  
        }
        req.user = user
        next();
    } catch (error) {
        throw new ApiError(400,"Unauthorized User you are") 
    }
}
export default authUser ; 