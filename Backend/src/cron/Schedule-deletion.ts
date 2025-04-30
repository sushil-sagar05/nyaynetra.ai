import cron from 'node-cron'
import UserModel from '../models/user.model'
import DocumentModel from '../models/document.model'
import { deleteFromCloudinary } from '../utils/cloudinary';
import fs from 'fs';
import path from 'path';
export const ScheduledDeletion = async()=>{
try {
  const retreivedDocument =  await DocumentModel.find({
        expiresAt: { $lt: new Date() }
    });
    for(const doc of retreivedDocument){
        {
            const filetype = doc.fileType;
            console.log(filetype)
            const public_id = doc.public_id_fromCloudinary;
            console.log(public_id)
            const userId = doc?.UploadedBy;
            const documentId = doc._id
             await deleteFromCloudinary(public_id,filetype);
             console.log("File deleted from cloudinary")
            await DocumentModel.findOneAndDelete({_id:documentId,UploadedBy:userId})
            console.log("File is deleted from Document Db")
            if(userId){
                await UserModel.findByIdAndUpdate({_id:userId},
                     {$pull:{documents:documentId}
                 },{new:true}
                 )
                 console.log("Document Id is also deleted")
            }
    }
    }
} catch (error) {
    console.log(error)
    console.error("Error in scheduled deletion:", error);
}
}

export const DeleteDeactivateUser = async()=>{
    try {
        const sevenDaysAgo = new Date(Date.now() - 7*24*60*60*1000)
        const usersToDelete = await UserModel.find({
            isdeleted:true,
            deletionRequestedAt:{$lt:sevenDaysAgo}
        })
        for(const user of usersToDelete){
            for(const docId of user.documents){
             const doc =  await DocumentModel.findById(docId)
             if(doc){
                await deleteFromCloudinary(doc.public_id_fromCloudinary,doc.fileType)
                await DocumentModel.findByIdAndDelete(docId)
             }

            }
            await UserModel.findByIdAndDelete(user._id)
            console.log(`user ${user.username, user.email} is permanently deleted`)
        }


    } catch (error) {
        console.log("error deleting user by cron",error)
    }
}
export const ScheduledDeletionforMulter = async()=>{
const temp_Upload_Dir = path.join('./public/temp');
const file_Expire_Time = 5*60*1000;
    fs.readdir(temp_Upload_Dir, (err, files) => {
      if (err) {
        return console.error('Error reading temp upload dir:', err);
      }
  
      const now = Date.now();
  
      files.forEach((file) => {
        if (file === '.gitkeep') return;
        const filePath = path.join(temp_Upload_Dir, file);
        fs.stat(filePath, (err, stats) => {
          if (err) {
            return console.error(' Error reading file stats:', err);
          }
  
          const fileAge = now - stats.mtime.getTime();
          if (fileAge > file_Expire_Time) {
            fs.unlink(filePath, (err) => {
              if (err) {
                console.error(` Failed to delete ${file}:`, err);
              } else {
                
              }
            });
          }
        });
      });
    });
}

cron.schedule("0 0 * * *",ScheduledDeletion)
cron.schedule("0 1 * * *",DeleteDeactivateUser)
cron.schedule("* * * * *",ScheduledDeletionforMulter)