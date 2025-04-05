import mongoose,{Schema,Document, Types} from "mongoose";
export interface IDocument extends Document{
    _id:string|mongoose.Types.ObjectId,
    filename:string,
    ClouinaryUrl:string,
    UploadedBy:Types.ObjectId|string,
    createdAt:Date;
    fileType:string;
    public_id_fromCloudinary:string
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
    type: String,
    enum:["pdf","docx","jpg","jpeg","png"],
    required:true
   },
   public_id_fromCloudinary:{
    type:String,
    required:true
   },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now
    }
})
const DocumentModel = mongoose.model<IDocument>("Document",DocumentSchema)
export default DocumentModel;