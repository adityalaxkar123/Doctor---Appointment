import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/admin.routes.js'
import doctorRouter from './routes/doctor.routes.js';
import userRouter from './routes/user.routes.js';
import orderRouter from './routes/order.routes.js';
//app config

const app = express();
const port = process.env.PORT || 4000;
connectDB()
connectCloudinary()
// middlewares
app.use(express.json())
app.use(cors())

// api endpoints
app.use('/api/admin',adminRouter);
app.use('/api/doctor',doctorRouter)
app.use('/api/user',userRouter)
app.use('/api/order',orderRouter)
// localhost:4000/api/admin

app.get('/',(req,res)=>{
    res.send('API WORKING great')
})

app.listen(port,()=>{
    console.log("Server started",port);
})

