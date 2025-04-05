import mongoose,{Schema,Document, Types} from "mongoose";
export interface IDocument extends Document{
    _id:string|mongoose.Types.ObjectId,
    filename:string,
    ClouinaryUrl:string,
    UploadedBy:Types.ObjectId|string,
    createdAt:Date;
    fileType:string;
    public_id_fromCloudinary:string,
    isSaved:Boolean,
    savedAt:Date,
    expiresAt:Date
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
   isSaved:{
    type:Boolean,
    default:false,
    required:true
   },
   savedAt:{
        type:Date,
        required:true,
        default:0
   },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now
    },
    expiresAt:{
        type:Date,
        required:true
    }
})
const DocumentModel = mongoose.model<IDocument>("Document",DocumentSchema)
export default DocumentModel;