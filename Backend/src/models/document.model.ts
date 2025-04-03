import mongoose,{Schema,Document, Types} from "mongoose";
export interface IDocument extends Document{
    _id:mongoose.Types.ObjectId
    filename:string,
    ClouinaryUrl:string,
    UploadedBy:Types.ObjectId,
    createdAt:Date;
    fileType?:Enumerator
} 
const DocumentSchema:Schema<IDocument> = new mongoose.Schema({
   filename:{
    type:String,
    required:true,
   },
   ClouinaryUrl:{
    type:String
   },
   UploadedBy:{
    type:Schema.Types.ObjectId,
    ref:"User"
   },
   fileType:{
    enum:["pdf","docx","jpg","jpeg","png"]
   },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now
    }
})
const DocumentModel = mongoose.model<IDocument>("Document",DocumentSchema)
export default DocumentModel;