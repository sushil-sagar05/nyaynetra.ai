// models/analysis.model.ts
import mongoose, { Schema, Document, Types } from "mongoose";

export interface Analysis extends Document {
  userId: Types.ObjectId;
  documentId: Types.ObjectId;
  summary: any;              
  risky_terms: any[];        
  key_clauses: any[];
  flask_doc_id?: string;        
  chat_ready?: boolean;        
  vector_storage_status?: string; 
  processing_time?: string;     
  chunk_count?: number;         
  analyzed_at?: Date;          
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
  flask_doc_id: {
    type: String,
    required: false 
  },
  chat_ready: {
    type: Boolean,
    default: false
  },
  vector_storage_status: {
    type: String,
    enum: ['pending', 'success', 'failed'],
    default: 'pending'
  },
  processing_time: {
    type: String,
    required: false
  },
  chunk_count: {
    type: Number,
    default: 0
  },
  analyzed_at: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

analysisSchema.index({ userId: 1, documentId: 1 }, { unique: true });
analysisSchema.index({ flask_doc_id: 1 });
analysisSchema.index({ chat_ready: 1 });

const AnalysisModel = mongoose.model<Analysis>("Analysis", analysisSchema);
export default AnalysisModel;
