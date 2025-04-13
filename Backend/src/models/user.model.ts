import mongoose,{Schema,Document,Types,Model} from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


// import dotenv from "dotenv";
// dotenv.config();
export interface User extends Document{
    _id: mongoose.Types.ObjectId;
    fullname:{
        firstname:string,
        lastname?:string
    },
    username:string;
    email:string;
    password:string;
    refreshToken:string|null;
    documents:Types.ObjectId[];
    generateAuthToken():string;
    generateRefreshToken():string;
    comparePassword(password:string):Promise<boolean>
    isdeleted:Boolean;
    deletionRequestedAt:Date|null

}
interface hashPasswordInterface extends Model<User>{
    hashPassword(password:string):Promise<string>
}
const UserSchema:Schema<User>=new mongoose.Schema({
    fullname:{
        firstname:{
            type:String,
            required:true,
            min:3
        },
    lastname:{
        type:String,
    }
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    refreshToken:{
        type:String,
        default:null
    },
    isdeleted:{
        type:Boolean,
        default:false
    },
    deletionRequestedAt:{
        type:Date,
        default:null
    },
    documents:[{
        type:Schema.Types.ObjectId,
        ref:"Document"
    }]
},{timestamps:true})

UserSchema.methods.generateAuthToken = function():string{
    if (!process.env.JWT_Secret) {
        throw new Error("JWT_SECRET is not defined");
    }
    const token = jwt.sign({_id:this._id},process.env.JWT_Secret,{expiresIn:'24h'});
    return token;
}
UserSchema.methods.generateRefreshToken=function():string{
    if(!process.env.REFRESH_TOKEN_SECRET){
     throw new Error("REFRESH_TOKEN_SECRET is not defined");
    }
    const token = jwt.sign({ _id:this._id,},process.env.REFRESH_TOKEN_SECRET,{expiresIn:"10d"});
    return token;
}
UserSchema.methods.comparePassword = async function(password:string):Promise<boolean>{
return await bcrypt.compare(password,this.password);
};
UserSchema.statics.hashPassword = async function(password): Promise<string>{
    return await bcrypt.hash(password,10);
}

const UserModel = mongoose.model<User,hashPasswordInterface>("User",UserSchema)
export default UserModel;