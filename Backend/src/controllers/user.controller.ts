import UserModel,{User} from "../models/user.model";
import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { CookieOptions } from "express";
import DocumentModel from "../models/document.model";
import mongoose from "mongoose";
import { deleteFromCloudinary } from "../utils/cloudinary";
import SettingModel from "../models/settings.model";
import { saveUserDocument } from "../Services/save.service";
import jwt from 'jsonwebtoken'
import { authLimiter } from "../middlewares/rate-limiter";
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
      const newSetting = new SettingModel({
        userId:newUser._id
      })
      await newSetting.save()
     const createdUser = await UserModel.findById(newUser._id).select("-password")

     const token = newUser.generateAuthToken();
     const options:CookieOptions={
        httpOnly:true,
        secure:true,
        sameSite:"none",
         maxAge:1 * 60 * 60 * 1000,
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
        await authLimiter.consume(req.ip as string)
        throw new ApiError(409,"User does not exist")
    }
    const isPasswordValid = await user.comparePassword(password)
    if(!isPasswordValid){
        await authLimiter.consume(req.ip as string)
        throw new ApiError(409,"Password is incorrect,Try again")
    }
    if(user.isdeleted===true&&user.deletionRequestedAt!< new Date()){
        user.isdeleted=false;
        user.deletionRequestedAt=null
        await user.save()
    }
    const {accessToken,refreshToken}=await generateAccessandRefreshToken(user._id.toString())
    const loggedInUser = await UserModel.findById(user._id).select('-password -refreshToken')
    const options:CookieOptions = {
        httpOnly:true,
        secure:true,
        sameSite:"none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
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
} catch (error:any) {
    if (error.msBeforeNext) {
        res.status(429).json({
         success: false,
         message: 'Too many failed login attempts. Try again after 10 min.',
       });
       return
   }
    if (error instanceof ApiError) {
        res.status(error.statusCode).json({ success: false, message: error.message });
        return;
       }
       res.status(500).json({ success: false, message: "Internal Server Error" });
}
}
const profile = async (req: authRequest, res: Response) => {
    if (!req.user) {
       res.status(200).json({ user: null, guest: true });
       return
    }
  
     res.status(200).json({ user: req.user, guest: false });
     return
  };
  
const logout = async(req:authRequest,res:Response)=>{
    try {
        const user = req.user
        if(!user){
            throw new ApiError(400,"User in not available")
        }
        await UserModel.findByIdAndUpdate(
         user._id,
         {$unset:{refreshToken:1}},
         {new:true}
        )
        const options = {
            httpOnly:true,
            secure:true
        }
        res.status(200)
        .clearCookie("token",options)
        .clearCookie("refreshToken",options)
        .json(new ApiResponse(200,{},"User logged out"))
    } catch (error) {
        console.log(error)
    }
}
const refreshAccessToken = async(req:authRequest,res:Response,next:NextFunction)=>{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    if(!incomingRefreshToken) {
        throw new ApiError(401, "unathorized request")
    }
   try {
    const decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET!
    ) as { _id: string };
    const user = await UserModel.findById(decodedToken?._id)
    if(!user) {
        throw new ApiError(401, "Invalid refresh token")
    }
    if (incomingRefreshToken !== user?.refreshToken) {
        throw new ApiError(401, "Refresh Token is expired or used")
    }
    const options = {
        httpOnly: true,
        secure: true
    }
    const {accessToken,refreshToken} = await  generateAccessandRefreshToken(user._id.toString())
    res
      .status(200)
      .cookie("accessToken",accessToken,options)
      .cookie("accessToken",refreshToken,options)
      .json(
        new ApiResponse(
            200,
            {accessToken,refreshToken},
            "Access token generated"
        )
      )
   } catch (error) {
    next(error)
   }
}
const saveDocument=async(req:authRequest,res:Response)=>{
    const user = req.user
    if(!user){
        throw new ApiError(409,"Guest is not allowed to save document , Register for this action")
    }
    const documentId = req.params.id
    await saveUserDocument(user.id, documentId);
    
    res.status(200)
    .json(new ApiResponse(200," Document Added Successfully"))
}
const listAllSavedDocument=async(req:authRequest,res:Response)=>{
    const User = req.user
    if(!User){
        new ApiError(400,"You need to be authenticated to view this page")
    }
 const retrievedUser =   await UserModel.findById({_id:User?.id}).populate('documents')
    if(!retrievedUser){
        new ApiError(400,"No user Found")
    }
    const SavedList = retrievedUser?.documents
    res.status(200)
    .json(new ApiResponse(200,SavedList,"Saved List Found"))
}
const DeleteSavedDocument = async(req:authRequest,res:Response)=>{
    try {
        const User = req.user
        if(!User){
             new ApiError(400,"You need to be authenticated to perform this task")
        }
        const documentId = req.params.documentId || req.body.documentId;
        const Document = await DocumentModel.findById({_id:documentId})
        if(!Document){
            throw new ApiError(400,"No Document Found");
        }
        const public_id=Document.public_id_fromCloudinary
        const fileType=Document.fileType
        await deleteFromCloudinary(public_id,fileType);
        const deletedDocument = await DocumentModel.findOneAndDelete({
            _id: documentId,
            UploadedBy: User?.id,  
        });
        if(!deletedDocument){
                throw new ApiError(400,"Document not found or user is not authorized for this task!")
         }
         await UserModel.findOneAndUpdate(
            {_id:User?.id},
            {$pull:{documents:documentId}},
            {new:true}
        )
        res.status(200)
        .json(new ApiResponse(200,"Document Successfully deleted"))
    } catch (error) {
        if (error instanceof ApiError) {
            res.status(error.statusCode).json({ success: false, message: error.message });
            return;
           }
           res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const AccountUpdation = async(req:authRequest,res:Response)=>{
    try {
        const user = req.user
        const {fullname} = req.body;
        if(!user){
            throw new ApiError(400,"You are not authenticated to do this task")
        }
        const retrievedUser = await UserModel.findByIdAndUpdate(user._id,
            {
                $set:{
                    fullname,
                }
            },{new:true}
        ).select('-password')
         res.status(200)
        .json(new ApiResponse(200,retrievedUser,"Account Updation successfully"))

    } catch (error) {
        if (error instanceof ApiError) {
            res.status(error.statusCode).json({ success: false, message: error.message });
            return;
           }
           res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
const EmailUpdation = async(req:authRequest,res:Response,next:NextFunction)=>{
   try {
     const  user = req.user
     if(!user){
         throw new ApiError(400,"You are not authenticated for this task")
     }
     const {newemail,currPassword} = req.body
     if(!newemail||!currPassword){
         throw new ApiError(400,"Please provide email and Password to update")
     }
     const emailNormalization = newemail.toLowerCase().trim();
     const retrievedUser = await UserModel.findById({_id:user._id})
     if(!retrievedUser){
         throw new ApiError(400,"User doesnot exist")
     }
     const isPasswordValid = await retrievedUser.comparePassword(currPassword)
     if(!isPasswordValid){
     throw new ApiError(400,"Password is incorrect,please try again")
     }
     if(emailNormalization ===retrievedUser.email.toLocaleLowerCase()){
        throw new ApiError(400,"This is your current email,Please provide new Email")
     }
     const checkEmailAvailable = await UserModel.findOne({email:emailNormalization})
     if(checkEmailAvailable&& checkEmailAvailable._id.toString()!=user._id.toString()){
     throw new ApiError(400,"Email is already taken by another user")
     }
     const newEmailUpdate = await UserModel.findByIdAndUpdate(user._id,
         {
             $set:{email:emailNormalization}
         },{new:true}
     ).select('-password')
     if(!newEmailUpdate){
         throw new ApiError(400,"Something went wrong while updating user's email")
     }
           res.status(200)
     .json(new ApiResponse(200,newEmailUpdate,"Email updated Successfully"))
   } catch (error) {
    next(error);
   }
}
const usernameUpdation = async(req:authRequest,res:Response,next:NextFunction)=>{
    try {
      const  user = req.user
      if(!user){
          throw new ApiError(400,"You are not authenticated for this task")
      }
      const {newUsername,currPassword} = req.body
      if(!newUsername|| !currPassword){
          throw new ApiError(400,"Please provide username and password to update")
      }
      const retrievedUser = await UserModel.findById({_id:user._id})
      if(!retrievedUser){
          throw new ApiError(400,"User doesnot exist")
      }
      const isPasswordValid = await retrievedUser.comparePassword(currPassword)
      if(!isPasswordValid){
      throw new ApiError(400,"Password is incorrect,please try again")
      }
      if(newUsername ===retrievedUser.username){
         throw new ApiError(400,"This is your current username,Please provide new username")
      }
      const checkusernameAvailable = await UserModel.findOne({username:newUsername})
      if(checkusernameAvailable&& checkusernameAvailable._id.toString()!=user._id.toString()){
      throw new ApiError(400,"username is already taken by another user")
      }
      const newUsernameUpdate = await UserModel.findByIdAndUpdate(user._id,
          {
              $set:{username:newUsername}
          },{new:true}
      ).select('-password')
      if(!newUsernameUpdate){
          throw new ApiError(400,"Something went wrong while updating user's email")
      }
       res.status(200)
      .json(new ApiResponse(200,newUsernameUpdate,"username updated Successfully"))
    } catch (error) {
        next(error);
    }
 }
const passwordUpdate = async(req:authRequest,res:Response,next:NextFunction)=>{
        try {
            const user = req.user
            if(!user){
                throw new ApiError(400,"You are not authenticated to this task")
            }
            const {oldPassword,newPassword} =req.body
            if(!newPassword){
                throw new ApiError(400,"Please provide password to update")
            }
            const retrievedUser= await UserModel.findById({_id:user._id})
            if(!retrievedUser){
                throw new ApiError(400,"User doesnot exist")
            }
           const isPasswordValid= await retrievedUser.comparePassword(oldPassword)
           if(!isPasswordValid){
            throw new ApiError(400,"incorrect password")
           }
           const hashedPassword = await UserModel.hashPassword(newPassword)
           retrievedUser.password=hashedPassword;
           await retrievedUser.save({validateBeforeSave:false})
            res.status(200)
           .json(new ApiResponse(200,{},"PasswordUpdated Successfully"))
        } catch (error) {
            next(error);
        }
    }
const accountDeletion = async(req:authRequest,res:Response,next:NextFunction)=>{
    try {
        const user = req.user
        if(!user){
            throw new ApiError(400,"User is not authenticated")
        }
        const {currPassword} = req.body
        const retrievedUser = await UserModel.findById({_id:user._id})
        if(!retrievedUser){
            throw new ApiError(400,"User does not exist")
        }
        const isPasswordValid =await retrievedUser.comparePassword(currPassword)
        if(!isPasswordValid){
            throw new ApiError(400,"Password is incorrect")
        }
        retrievedUser.refreshToken=null
        retrievedUser.isdeleted=true
        retrievedUser.deletionRequestedAt=new Date()
        await retrievedUser.save()
        const options = {
            httpOnly:true,
            secure:true
        }
        res.status(200)
        .clearCookie("token",options)
        .clearCookie("refreshToken",options)
        .json(new ApiResponse(200,{},"Account deleted sucessfully you can reactivate it within 7 days by login back otherwise will be deleted permanently"))

    } catch (error) {
        next(error)
    }
}

const userController = {
    register,
    login,
    profile,
    logout,
    saveDocument,
    listAllSavedDocument,
    DeleteSavedDocument,
    AccountUpdation,
    EmailUpdation,
    usernameUpdation,
    passwordUpdate,
    accountDeletion,
    refreshAccessToken

}
export default userController