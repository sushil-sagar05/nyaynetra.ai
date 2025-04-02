import mongoose,{Schema,Document} from "mongoose";
export interface IDocument extends Document{
    // content
    _id:mongoose.Types.ObjectId
    createdAt:Date;
} 
const DocumentSchema:Schema<IDocument> = new mongoose.Schema({
    createdAt:{
        type:Date,
        required:true,
        default:Date.now
    }
})
const DocumentModel = mongoose.model<IDocument>("Document",DocumentSchema)
export default DocumentModel;