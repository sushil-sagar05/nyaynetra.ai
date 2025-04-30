import UserModel, { User } from "../models/user.model";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface AuthRequest extends Request {
  user?: User;
}

const optionalAuthUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return next();
    }

    if (!process.env.JWT_SECRET) {
      console.warn("JWT_SECRET is not set.");
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
    const user = await UserModel.findById(decoded._id);
    if (user) {
      req.user = user;
    }

    return next(); 
  } catch (error) {
    return next();
  }
};

export default optionalAuthUser;
