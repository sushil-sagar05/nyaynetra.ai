import express from "express";
import {validationSchema} from '../middlewares/zodValidation.middleware'
import {registerSchema} from '../schemas/registerSchema'
import { loginSchema } from "../schemas/loginSchema";
import userController from '../controllers/user.controller'
import authUser from "../middlewares/auth.middleware"

const router = express.Router();

router.post('/register',validationSchema(registerSchema),userController.register)
router.post('/login',validationSchema(loginSchema),userController.login)
//secured Routes
router.get('/profile',authUser,userController.profile);
router.post('/:id/save-document',authUser,userController.saveDocument)
router.post('/saved-list',authUser,userController.listAllSavedDocument)
router.post('/delete-save-document/:documentId',authUser,userController.DeleteSavedDocument)



export default router;

