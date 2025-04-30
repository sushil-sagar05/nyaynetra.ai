import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import DocumentModel from "../models/document.model";
import { deleteFromCloudinary, ifFileExists, uploadOnCloudinary } from "../utils/cloudinary";
import { User } from "../models/user.model";
import fs from 'fs'
import crypto from 'crypto'
import SettingModel from "../models/settings.model";
import userController from "./user.controller";
import { saveUserDocument } from "../Services/save.service";
import { guestrateLimiter } from "../middlewares/rate-limiter";
interface authRequest extends Request{
    user?:User
}

const generateFileHash = (filePath: string): Promise<string> => {
    //generate a crypto hash for filepath 
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash('sha256');
        const stream = fs.createReadStream(filePath);
        
        stream.on('data', (chunk) => {
            hash.update(chunk);
        });
        
        stream.on('end', () => {
            resolve(hash.digest('hex'));  
        });
        
        stream.on('error', (err) => {
            reject(err);
        });
    });
};



const uploadDocument = async(req:authRequest,res:Response)=>{
    //check if file is uploaded
    //save file temporary on the server
    // determine file type
    //upload file to cloudinary
    //save document details in mongodb
    //send response
    //delete temperory file from the server after 5 minutes
    
    try {
        const user = req?.user?.id
        const file = req.file
        if(!file){
            throw new ApiError(400,"No Document is uploaded")  
        }
        const filePath = file.path
        const filename=file.filename
        if(!filePath){
            throw new ApiError(400,"Document path is required ")
            }  
            const fileType = file.mimetype.split("/")[1]
            const allowedFileType =["pdf","docx","jpg","jpeg","png"]
            if(!allowedFileType.includes(fileType)){
                fs.unlinkSync(filePath);
                throw new ApiError(400,"File Type is invalid ")
            }
            const fileHash = await generateFileHash(filePath);
            const checkExisting = await DocumentModel.findOne({fileHash})
            const expiresAtFromnow = new Date(); 
            expiresAtFromnow.setDate(expiresAtFromnow.getDate() + 7);
            const expiresForGuest = new Date();
            expiresForGuest.setMinutes(expiresForGuest.getMinutes()+15)
            if(checkExisting){
                const newdocument =new DocumentModel ({
                    UploadedBy:user?user:null,
                    fileType,
                    filename,
                    isSaved:false,
                    expiresAt:user?expiresAtFromnow:expiresForGuest,
                    fileHash,
                    ClouinaryUrl:checkExisting.
                    ClouinaryUrl,
                    public_id_fromCloudinary:checkExisting.public_id_fromCloudinary,
                    isGuest:user?false:true
                })
             const savedDocument = await newdocument.save();
             const retreivedUserSetting =   await SettingModel.findOne({userId:user})
            if(retreivedUserSetting?.autoSave===true){
                await saveUserDocument(user, savedDocument.id);
            }
            if (!user) {
                await guestrateLimiter.consume(req.ip as string); 
            }
             res.status(200)
            .json(new ApiResponse(201,savedDocument,"Document Created (from existing)"))
            return
            }
            const document = await uploadOnCloudinary(filePath,fileType)
            const {public_id} = document;
            if(!document){
                throw new ApiError(400,"Something went wrong while uploading document on cloudinary ")   
            }
            const newdocument =new DocumentModel ({
                UploadedBy:user?user:null,
                fileType,
                filename,
                ClouinaryUrl:document?.url,
                public_id_fromCloudinary:public_id,
                isSaved:false,
                expiresAt:user?expiresAtFromnow:expiresForGuest,
                fileHash,
                isGuest:user?false:true
            })
            const savedDocument = await newdocument.save();
            if(!savedDocument){
                fs.unlinkSync(filePath);
                throw new ApiError(400,"Something went wrong while saving document!")
            }
            if (!user) {
                await guestrateLimiter.consume(req.ip as string); // Apply rate limit for guests
              }
            const retreivedUserSetting =   await SettingModel.findOne({userId:user})
            if(retreivedUserSetting?.autoSave===true){
                await saveUserDocument(user, savedDocument.id);
            }
            res.status(200)
        .json(new ApiResponse(201,savedDocument,"Document Created"))

        setTimeout(() => {
            console.log(`Checking if the file exists at ${filePath}`); 
            if (fs.existsSync(filePath)) {
              try {
                fs.unlinkSync(filePath);
              } catch (error) {
                console.error('Error deleting file:', error);
              }
            } else {
              console.log('File does not exist or already deleted');
            }
          }, 1 * 60 * 1000); 
    }  catch (error:any) {
        console.error("Error details: ", error); 
        if (error.msBeforeNext) {
            res.status(429).json({
              success: false,
              message: "Upload limit reached. Please wait 1 hour or register.",
            });
            return
          }
        if (error instanceof ApiError) {
            res.status(error.statusCode).json({ success: false, message: error.message });
        } else {
            res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
        }
    }
}

const getAllUploadedDocument = async(req:authRequest,res:Response): Promise<void>=>{
// Retrieve all the documents of authenticated user
// send res them
try {
    const user = req.user
    if(!user){
        throw new ApiError(400,"Something went wrong while retrieving user!")
    }
    const userId = user.id
    const userUploadedDocuments = await DocumentModel.find({UploadedBy:userId})
    if(!userUploadedDocuments){
        throw new ApiError(400,"Document not found")
    } 
    const formattedDocuments = userUploadedDocuments.map((doc=>{
        const docObj = doc.toObject();
         docObj._id = docObj._id.toString();         
            docObj.UploadedBy = docObj.UploadedBy.toString();  
            return docObj;
    }))
    res.status(200).json(new ApiResponse(200, formattedDocuments, "Documents retrieved successfully"));
} catch (error) {
    if (error instanceof ApiError) {
        console.error("Caught ApiError: ", error);
         res.status(error.statusCode).json({
            success: false,
            message: error.message,
        });
        return
    }
    console.error("Unexpected error: ", error);
     res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });

}
}
const getDocumentById = async(req:authRequest,res:Response)=>{
    //get unique document from authenticated user's document collection
try {
        const DocumentId = req.params.id
        const Document = await DocumentModel.find({_id:DocumentId})
        if(!Document){
            throw new ApiError(400,"Movie Doesnot Exist in User DB")
        }
    
        res.status(200)
        .json(new ApiResponse(200,Document,"Document Fetched"))
} catch (error) {
    if (error instanceof ApiError) {
        res.status(error.statusCode).json({ success: false, message: error.message });
        return;
       }
       res.status(500).json({ success: false, message: "Internal Server Error" })
}
}

const deleteDocument = async(req:authRequest,res:Response)=>{
    //delete document from authenticated user's document model
   try {
     const user = req.user
     if(!user){
         throw new ApiError(400,"Something went wrong while retrieving user!")
     }
     const userId = user.id
     const DocumentId = req.params.id
     //now when document is deleted from db now delete it from cloudinary also
     const Document = await DocumentModel.findById({_id:DocumentId})
     if(!Document){
    throw new ApiError(400,"No Document Found");
     }
     const public_id = Document.public_id_fromCloudinary
     const fileType = Document.fileType
     const fileExistsOncloudinary = await ifFileExists(public_id,fileType)
     if(!fileExistsOncloudinary){
        console.log(`File with public_id ${public_id} does not exist on Cloudinary.`);
        return;
     }
   const deleteUpdate= await deleteFromCloudinary(public_id,fileType);
      const deletedDocument = await DocumentModel.findOneAndDelete({
         _id: DocumentId,
         UploadedBy: userId,  
     });
     if(!deletedDocument){
        throw new ApiError(400,"Document not found or user is not authorized for this task!")
     }
     res.status(200)
     .json(new ApiResponse(200,deleteUpdate,"Document Deleted Successfully"))
   } catch (error) {
    if (error instanceof ApiError) {
        res.status(error.statusCode).json({ success: false, message: error.message });
        return;
       }
       res.status(500).json({ success: false, message: "Internal Server Error" })
   }
}

const documentController = {
    uploadDocument,
    getAllUploadedDocument,
    getDocumentById,
    deleteDocument
}
export default documentController;