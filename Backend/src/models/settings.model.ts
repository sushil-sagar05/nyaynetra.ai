import mongoose,{Schema,Document,Types,Model} from 'mongoose'

interface Settings extends Document{
    userId:Types.ObjectId;
    theme:string;
    language:string;
    clauseHighLighting:Boolean;
    autoSave:Boolean

}

const settingSchema:Schema<Settings>=new mongoose.Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    theme:{
        type:String,
        enum:['light','dark'],
        default:'light',
        required:true
    },
    language:{
        type:String,
        default:'en',
        required:true
    },
    clauseHighLighting:{
        type:Boolean,
        default:true,
        required:true
    },
    autoSave:{
        type:Boolean,
        default:false,
        required:true
    }
},{timestamps:true})

const SettingModel = mongoose.model<Settings>("Setting",settingSchema)
export default SettingModel