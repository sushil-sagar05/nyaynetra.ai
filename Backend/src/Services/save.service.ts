import mongoose from "mongoose";
import DocumentModel from "../models/document.model";
import UserModel from "../models/user.model";
import { ApiError } from "../utils/ApiError";

export const saveUserDocument = async (userId: string, documentId: string) => {
    const newDateForExpiry = new Date();
    newDateForExpiry.setDate(newDateForExpiry.getDate() + 14);

    const objectId = new mongoose.Types.ObjectId(documentId);

    const retrievedDocument = await DocumentModel.findByIdAndUpdate(
        { _id: documentId },
        {
            $set: {
                isSaved: true,
                savedAt: Date.now(),
                expiresAt: newDateForExpiry,
            },
        },
        { new: true }
    );

    if (!retrievedDocument) {
        throw new ApiError(409, "Document not found or already saved");
    }

    const retrievedUser = await UserModel.findOneAndUpdate(
        { _id: userId },
        {
            $addToSet: {
                documents: objectId,
            },
        },
        { new: true }
    );

    if (!retrievedUser) {
        throw new ApiError(400, "Failed to update user's saved list");
    }

    return retrievedDocument;
};
