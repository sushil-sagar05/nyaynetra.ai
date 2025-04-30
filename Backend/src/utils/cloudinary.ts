import {v2 as cloudinary} from 'cloudinary'
import fs  from 'fs'
import { ApiError } from "./ApiError";
import { promisify } from 'util';

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET
})


const uploadOnCloudinary = async (localFilePath: string,fileType:string) => {
    try {
       const imageTypes = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'svg']
       let resourceType: 'image' | 'raw' = 'raw';
       if (imageTypes.includes(fileType)) {
        resourceType = 'image'; 
    } else  {
        resourceType = 'raw';
    }

   
    const response = await cloudinary.uploader.upload(localFilePath, {
        folder: 'law documents',  
        resource_type: resourceType,  
    });
    return response;
     } catch (error) {
       
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        console.error('Error during file upload:', error);
        throw new ApiError(400, "Upload failed, could not process the file.");
    }
};

const ifFileExists = async(publicId:string,fileType:string)=>{
    const resourceType = (fileType === 'pdf' || fileType === 'doc' || fileType === 'docx') ? 'raw' : 'image';
    try {
        const result = await cloudinary.api.resource(publicId,{resource_type:resourceType});
        return result;
    } catch (error) {
        console.error("Error checking file existence on Cloudinary:", error);
        return null; 
    }
}

const deleteFromCloudinary = async (publicId: string,fileType:string) => {
    const resourceType = (fileType === 'pdf' || fileType === 'doc' || fileType === 'docx') ? 'raw' : 'image';
    try {
        const result = await cloudinary.uploader.destroy(publicId,{resource_type:resourceType});
        return result
    } catch (error) {
        console.error("Error deleting from Cloudinary: ", error);
    }
};
export {uploadOnCloudinary,ifFileExists,deleteFromCloudinary}