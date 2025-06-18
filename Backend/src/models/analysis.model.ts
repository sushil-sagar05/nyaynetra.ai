// analyze model
import mongoose,{Schema,Document,Types} from "mongoose";
export interface Analysis extends Document {
  userId: Types.ObjectId;
  documentId: Types.ObjectId;
  summary: any;              
  risky_terms: any[];        
  key_clauses: any[];        
}



const analysisSchema = new Schema<Analysis>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  documentId: {
    type: Schema.Types.ObjectId,
    ref: "Document",
    required: true,
  },
  summary: {
    type: Schema.Types.Mixed,  
    required: true,
  },
risky_terms: {
  type: [mongoose.Schema.Types.Mixed as any],
  required: true,
},
key_clauses: {
  type: [mongoose.Schema.Types.Mixed as any],
  required: true,
},
}, { timestamps: true });

analysisSchema.index({ userId: 1, documentId: 1 }, { unique: true });
const AnalysisModel = mongoose.model<Analysis>("Analysis",analysisSchema)
export default AnalysisModel