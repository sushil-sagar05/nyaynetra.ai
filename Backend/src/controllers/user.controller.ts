import UserModel,{User} from "../models/user.model";
import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { CookieOptions } from "express";
interface authRequest extends Request{
    user?:User
}

const generateAccessandRefreshToken = async(userId:string)=>{
    try {
        const user = await UserModel.findById(userId)
        if(!user){
            throw new Error("User not found");
        }
        const accessToken =  user?.generateAuthToken()
        const refreshToken = user?.generateRefreshToken()
         user.refreshToken = refreshToken;
         await user.save({validateBeforeSave: false})
         return {accessToken,refreshToken}
    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating refresh and access token")
    }
}
const register = async(req:Request,res:Response)=>{
    try {
     const {fullname,username,email,password} = req.body;
     const existedUser = await UserModel.findOne({$or:[{username},{email}]})
     if(existedUser){
        throw new ApiError(409,"User with this username or email already exist")
        
     }
     const hashedPassword  = await UserModel.hashPassword(password);
     if(!hashedPassword){
        throw new ApiError(400,"Something went Wrong with hashing password")
     }
     const newUser = new UserModel({
        fullname:{
            firstname:fullname.firstname,
            lastname:fullname.lastname
        },
        username:username.toLowerCase(),
        email,
        password:hashedPassword,
        documents:[]
     })
     await newUser.save();
     const createdUser = await UserModel.findById(newUser._id).select("-password")

     const token = newUser.generateAuthToken();
     const options:CookieOptions={
        httpOnly:true,
        secure:true,
        sameSite:"none",
         maxAge:7 * 24 * 60 * 60 * 1000,
     }
    res.status(201)
  .cookie("token", token, options)
  .json(
      new ApiResponse(200, createdUser, "User registered Successfully")
  )
    
    } catch (error) {
        if (error instanceof ApiError) {
         res.status(error.statusCode).json({ success: false, message: error.message });
         return;
        }
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }    

}
const login = async(req:Request,res:Response)=>{
try {
    const {identifier,password} = req.body;
    const user = await UserModel.findOne({
        $or:[{email:identifier},{username:identifier}]
    })
    if(!user){
        throw new ApiError(409,"User does not exist")
    }
    const isPasswordValid = await user.comparePassword(password)
    if(!isPasswordValid){
        throw new ApiError(409,"Password is incorrect,Try again")
    }
    const {accessToken,refreshToken}=await generateAccessandRefreshToken(user._id.toString())
    const loggedInUser = await UserModel.findById(user._id).select('-password -refreshToken')
    const options = {
        httpOnly: true,
        secure: true
    }
     res.status(201)
    .cookie("token",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
             user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )
} catch (error) {
    if (error instanceof ApiError) {
        res.status(error.statusCode).json({ success: false, message: error.message });
        return;
       }
       res.status(500).json({ success: false, message: "Internal Server Error" });
}
}
const profile =async(req:authRequest,res:Response)=>{
    res.status(200).json({user:req.user})
}
const userController = {
    register,
    login,
    profile
}
export default userController