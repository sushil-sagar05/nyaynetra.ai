import express from "express";
import {validationSchema} from '../middlewares/zodValidation.middleware'
import {registerSchema} from '../schemas/registerSchema'
import { loginSchema } from "../schemas/loginSchema";
import userController from '../controllers/user.controller'
import authUser from "../middlewares/auth.middleware"
import { passwordUpdateSchema } from "../schemas/passwordUpdate.Schema";
const router = express.Router();

router.post('/register',validationSchema(registerSchema),userController.register)
router.post('/login',validationSchema(loginSchema),userController.login)
//secured Routes
router.get('/profile',authUser,userController.profile);
router.post('/logout',authUser,userController.logout);
router.post('/:id/save-document',authUser,userController.saveDocument)
router.post('/saved-list',authUser,userController.listAllSavedDocument)
router.delete('/delete-save-document',authUser,userController.DeleteSavedDocument)
router.patch('/update-fullname',authUser,userController.AccountUpdation)
router.patch('/update-email',authUser,userController.EmailUpdation)
router.patch('/update-username',authUser,userController.usernameUpdation)
router.post('/update-password',authUser,validationSchema(passwordUpdateSchema),userController.passwordUpdate)



export default router;

