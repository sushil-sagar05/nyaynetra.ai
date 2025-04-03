import {v2 as cloudinary} from 'cloudinary'
import fs  from 'fs'
import { ApiError } from "./ApiError";


cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET
})


const uploadOnCloudinary = async(localFilePath:string)=>{
    try {
        if(!localFilePath){
            throw new ApiError(400,"Failed")
        }
        const extention = localFilePath.toLowerCase();
        let resourcesType :"raw"|"image"="raw";
        if (["jpg", "png", "jpeg"].includes(extention)) {
            resourcesType = "image";
        } 
        const response = await cloudinary.uploader.upload(localFilePath,{
            folder:"law documents",
            resource_type:resourcesType,
        })
        //file has been uploaded 
        console.log("File is uploaded on cloudinary",
            response.url
        );
        return response;
    } catch (error) {
        //remove the locally saved temporary file as the uploading operation got failed
        fs.unlinkSync(localFilePath)
        throw new ApiError(400,"null")
    }

}
export {uploadOnCloudinary}