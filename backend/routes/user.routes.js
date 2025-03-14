import express from 'express'
import upload from '../middlewares/multer.middlewares.js'
import { registerUser,loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment, paymentRazorpay, verifyRazorpay } from '../controllers/user.controller.js'
import authUser from '../middlewares/authUser.js'
import { cancelOrder, getUserOrder, orderFrontend, orderRazorpay, verifyOrderRazorpay } from '../controllers/order.controller.js'
const userRouter = express.Router()

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.get('/get-profile',authUser,getProfile)
userRouter.post('/update-profile',upload.single('image'),authUser,updateProfile)
userRouter.post('/book-appointment',authUser,bookAppointment)
userRouter.get('/appointments',authUser,listAppointment)
userRouter.post('/cancel-appointment',authUser,cancelAppointment)
userRouter.post('/payment-razorpay',authUser,paymentRazorpay)
userRouter.post('/verify-razorpay',authUser,verifyRazorpay)
userRouter.post('/order',authUser,orderFrontend)
userRouter.get('/userOrder',authUser,getUserOrder)
userRouter.post('/cancel-order',authUser,cancelOrder)
userRouter.post('/payment-orderRazorpay',authUser,orderRazorpay)
userRouter.post('/verify-medOrderRazorpay',authUser,verifyOrderRazorpay)
export default userRouter

