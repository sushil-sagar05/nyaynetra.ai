import { rateLimit } from 'express-rate-limit'
import { Request } from 'express'
import { User } from '../models/user.model';
interface authRequest extends Request{
    user?:User
}
export const limiter = rateLimit({
    limit:10,
    windowMs: 10 * 60 * 1000,
    keyGenerator:(req:authRequest):string=>{
        if (req.user?.id) {
            return req.user.id; 
        }
        return req.ip|| "User Ananynomus"; 
    },
    message: "You have reached the limit of Uploading document . Please try after some time"
})
export const guestLimiter = rateLimit({
    limit:5,
    windowMs:60*60*60,
    message: "You have reached the limit of Uploading document . Please register or wait for 1 hr"
})
