import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import DocumentModel from "../models/document.model";
import { deleteFromCloudinary, ifFileExists, uploadOnCloudinary } from "../utils/cloudinary";
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
        console.log("Mimi-type",file.mimetype)
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
            const document = await uploadOnCloudinary(filePath,fileType)
            const {public_id} = document;
            console.log("Public id get in response",public_id) 
            if(!document){
                throw new ApiError(400,"Something went wrong while uploading document on cloudinary ")   
            }
        const user = req?.user?.id
        const newdocument =new DocumentModel ({
            UploadedBy:user,
            fileType,
            filename,
            ClouinaryUrl:document?.url,
            public_id_fromCloudinary:public_id
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
    }  catch (error:any) {
        console.error("Error details: ", error); 
        if (error instanceof ApiError) {
            res.status(error.statusCode).json({ success: false, message: error.message });
        } else {
            res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
        }
    }
}

const getAllUploadedDocument = async(req:authRequest,res:Response)=>{
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
    console.log(formattedDocuments)
    res.status(200).json(new ApiResponse(200, formattedDocuments, "Documents retrieved successfully"));
} catch (error) {
    if (error instanceof ApiError) {
        res.status(error.statusCode).json({ success: false, message: error.message });
        return;
       }
       res.status(500).json({ success: false, message: "Internal Server Error" })
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
     console.log("Public id retreived",public_id);
     console.log("Whole document: ",Document)
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