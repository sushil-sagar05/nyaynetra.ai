import express from 'express'
import settingController from '../controllers/settings.controller'
import authUser from '../middlewares/auth.middleware';

const router = express.Router();
router.get('/get-settings',authUser,settingController.getSettings)
router.patch('/update-settings',authUser,settingController.updateSettings)
router.patch('/reset-setting',authUser,settingController.resetSettings)



export default router