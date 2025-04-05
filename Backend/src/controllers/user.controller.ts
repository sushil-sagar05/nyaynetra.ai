import UserModel,{User} from "../models/user.model";
import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { CookieOptions } from "express";
import DocumentModel from "../models/document.model";
import mongoose from "mongoose";
import { deleteFromCloudinary } from "../utils/cloudinary";
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
const saveDocument=async(req:authRequest,res:Response)=>{
    const user = req.user
    if(!user){
        throw new ApiError(409,"Guest is not allowed to save document , Register for this action")
    }
    const userId = user.id
    const documentId = req.params.id
    const newDateForExpiry = new Date()
    newDateForExpiry.setDate(newDateForExpiry.getDate()+14);
    const ObjectId = new mongoose.Types.ObjectId(documentId)
    const retreivedDocument = await DocumentModel.findByIdAndUpdate(
        {_id:documentId},
        {
            $set:{
                isSaved:true,
                savedAt:Date.now(),
                expiresAt:newDateForExpiry
            }
        },
        {new:true}
    )
    if(!retreivedDocument){
        throw new ApiError(409,"Document not found or it is saved ")
    }
    const retrievedUser = await UserModel.findOneAndUpdate({_id:userId},{
        $addToSet:{
            documents:ObjectId
        }
    },{new:true})
    if(!retrievedUser){
        throw new ApiError(400,"Failed to Update User's saved List")
    }
    res.status(200)
    .json(new ApiResponse(200," Document Added Successfully"))
}
const listAllSavedDocument=async(req:authRequest,res:Response)=>{
    const User = req.user
    if(!User){
        new ApiError(400,"You need to be authenticated to view this page")
    }
 const retrievedUser =   await UserModel.findById({_id:User?.id})
    if(!retrievedUser){
        new ApiError(400,"No user Found")
    }
    const SavedList = retrievedUser?.documents
    res.status(200)
    .json(new ApiResponse(200,SavedList,"Saved List Found"))
}
const DeleteSavedDocument = async(req:authRequest,res:Response)=>{
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
}
const userController = {
    register,
    login,
    profile,
    saveDocument,
    listAllSavedDocument,
    DeleteSavedDocument
}
export default userController