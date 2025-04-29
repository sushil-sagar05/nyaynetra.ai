import { RateLimiterMemory } from 'rate-limiter-flexible';
import { NextFunction, Request, Response } from 'express';
import { User } from '../models/user.model';
interface authRequest extends Request{
    user?:User
}
export const guestrateLimiter = new RateLimiterMemory({
  points: 5, 
  duration: 60 * 60, 
});


export const rateLimitMiddleware = async (req: authRequest, res: Response, next: NextFunction) => {
  try {

    await guestrateLimiter.consume(req.ip as string);
    next();
  } catch (err) {
    res.status(429).json({
      success: false,
      message: 'Upload limit reached. Please wait 1 hour or register.',
    });
  }
};

export const settingsLimiter = new RateLimiterMemory({
    points:10,  
  duration: 7 * 24 * 60 * 60,
})

export const settingratelimiter = async(req: authRequest, res: Response, next: NextFunction)=>{
    try {
        await settingsLimiter.consume(req?.user?.id)
        next()
    } catch (error) {
        res.status(429).json({
            success: false,
            message: 'You have reached the Account Update limit, wait for',
          }); 
    }
}
export const authLimiter = new RateLimiterMemory({
    points:5,
    duration:60*10

})
