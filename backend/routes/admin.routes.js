import express from 'express'
import { addDoctor,adminDashboard,allDoctors,appointmentAdmin,appointmentCancel,loginAdmin} from '../controllers/admin.controller.js'
import upload from '../middlewares/multer.middlewares.js'
import authAdmin from '../middlewares/authAdmin.middlewares.js'
import { changeAvailability } from '../controllers/doctor.controller.js'

const adminRouter = express.Router()

adminRouter.post('/add-doctor',authAdmin,upload.single('image'),addDoctor)
adminRouter.post('/login',loginAdmin)
adminRouter.post('/all-doctors',authAdmin,allDoctors)
adminRouter.post('/change-availability',authAdmin,changeAvailability)
adminRouter.get('/appointments',authAdmin,appointmentAdmin)
adminRouter.post('/cancel-appointment',authAdmin,appointmentCancel)
adminRouter.get('/dashboard',authAdmin,adminDashboard)

export default adminRouter