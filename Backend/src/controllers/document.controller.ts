import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import DocumentModel from "../models/document.model";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { User } from "../models/user.model";
import fs from 'fs'
interface authRequest extends Request{
    user?:User
}

const uploadDocument = async(req:authRequest,res:Response)=>{
//check if file is uploaded
//save file temporary on the server
// determine file type
//upload file to cloudinary
//save document details in mongodb
//send response
//delete temperory file from the server after 5 minutes

try {
    const file = req.file
    if(!file){
        throw new ApiError(400,"No Document is uploaded")  
    }
    const filePath = file?.path
    const filename=file?.filename
    if(!filePath){
        throw new ApiError(400,"Document path is required ")
        }  
        const fileType = file.mimetype.split("/")[1]
        const allowedFileType =["pdf","docx","jpg","jpeg","png"]
        if(!allowedFileType.includes(fileType)){
            fs.unlinkSync(filePath);
            throw new ApiError(400,"File Type is invalid ")
        }
        const document = await uploadOnCloudinary(filePath)
        if(!document){
            throw new ApiError(400,"Something went wrong while uploading document on cloudinary ")   
        }
    const user = req?.user?.id
    const newdocument =new DocumentModel ({
        UploadedBy:user,
        fileType,
        filename,
        ClouinaryUrl:document?.url
    })
    const savedDocument = await newdocument.save();
    if(!savedDocument){
        throw new ApiError(400,"Something went wrong while saving document!")
    }
    res.status(200)
    .json(new ApiResponse(201,savedDocument,"Document Created"))
    setTimeout(() => {
        if(fs.existsSync(filePath)){
            fs.unlinkSync(filePath)
        }
    }, 5*60*1000);
} catch (error) {
    if (error instanceof ApiError) {
        res.status(error.statusCode).json({ success: false, message: error.message });
        return;
       }
       res.status(500).json({ success: false, message: "Internal Server Error" });
}
}


const documentController = {
    uploadDocument,
}
export default documentController;