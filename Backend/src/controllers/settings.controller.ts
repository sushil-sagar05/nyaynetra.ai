import SettingModel from "../models/settings.model";
import { NextFunction,Response,Request } from "express";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { User } from "../models/user.model";
interface authRequest extends Request{
    user?:User
}

const getSettings = async(req:authRequest,res:Response,next:NextFunction)=>{
   try {
     const user = req.user
     if(!user){
         throw new ApiError(400,"User is not authenticated");
     }
     const retrievedUserSetting = await SettingModel.findOne({userId:user._id})
     res.status(200)
     .json(new ApiResponse(200,retrievedUserSetting,"Settings"))
   } catch (error) {
    next(error)
   }
}

const updateSettings=async(req:authRequest,res:Response,next:NextFunction)=>{
    try {
        const user = req.user
        if(!user){
            throw new ApiError(400,"User is not authenticated")
        }
        const updates = req.body
        const updateObject:any= {}
        for( const update in updates){
            if(update!=undefined){
                updateObject[update]=updates[update]
            }
        }
        const UpdatedSetting = await SettingModel.findOneAndUpdate({userId:user._id},updateObject,{new:true})
        if(!UpdatedSetting){
            throw new ApiError(400,"Something went wrong in updating setting")
        }
        res.status(200)
        .json(new ApiResponse(200,UpdatedSetting,"Setting Updated Successfully"))

    } catch (error) {
        next(error)
    }
}

const resetSettings = async(req:authRequest,res:Response,next:NextFunction)=>{
    try {
        const user = req.user
        if(!user){
            throw new ApiError(400,"User is not authenticated")
        }
        const retrievedUserUpdatedSetting = await SettingModel.findOneAndUpdate({userId:user._id},
            {
                theme:'light',
                language:'en',
                clauseHighLighting:true,
                autoSave:false
            },{new:true}
        )
        res.status(200)
        .json(new ApiResponse(200,retrievedUserUpdatedSetting,"Reset to default setting"))
    } catch (error) {
        next(error)
    }
}

const settingController ={
    getSettings,
    updateSettings,
    resetSettings
}
export default settingController