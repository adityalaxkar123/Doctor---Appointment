import validator from 'validator'
import bcrypt from 'bcrypt'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from '../models/doctor.models.js'
import jwt from 'jsonwebtoken'
import appointmentModel from '../models/appointment.models.js'
import userModel from '../models/user.models.js'
import medicineModel from '../models/medicine.models.js'
// API for adding doctor
const addDoctor = async(req,res) =>{

    try {
        const {name,email,password,speciality,degree,experience,about,fees, address} = req.body;
        const imageFile = req.file

        // console.log({name,email,password,speciality,degree,experience,about,fees, address},imageFile)
        if(!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address){
            return res.json({success:false,message:"Missing Details"})
        }

        if(!validator.isEmail(email)){
            return res.json({success:false,message:"Please Enter a valid email"})
        }
        if(password.length < 8){
            return res.json({success:false,message:"Poor password try Strong one"})
        }

        // hashing doctor password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        // upload image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type:"image"})
        const imageUrl = imageUpload.secure_url;

        const doctorData = {
            name,
            email,
            image:imageUrl,
            password:hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address:JSON.parse(address),
            date:Date.now()
        }

        const newDoctor = new doctorModel(doctorData)
        await newDoctor.save()

        return res.json({success:true,message:"doctor added"})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }

}

// API for adding medicine
const addMedicine = async(req,res) =>{

    try {
        const {name,category,price,mg} = req.body;
        const imageFile = req.file
        if(!name || !category || !price || !mg){
            return res.json({success:false,message:"Missing Details"})
        }
        const existed = await medicineModel.findOne({name})
        if(existed){
            return res.json({success:false,message:"already exist"})
        }
        // upload image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type:"image"})
        const imageUrl = imageUpload.secure_url;

        const medicineData = {
            name,
            category,
            price,
            mg,
            image:imageUrl,
        }

        const newMedicine = new medicineModel(medicineData)
        await newMedicine.save()

        return res.json({success:true,message:"medicine added"})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }

}
//API to get all medicine list
const medicineList = async(req,res)=>{
    try {
        const medicines = await medicineModel.find({})

        res.json({success:true,medicines})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

// API for admin Login

const loginAdmin = async(req,res)=>{
    try {
        const {email,password} = req.body

        // console.log(req.body)
        // console.log(email)
        // console.log(password)
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
            const token = jwt.sign(email+password,process.env.JWT_SECRET)
            res.json({success:true,token})
        }
        else{
            res.json({success:false,message:"Invalid credentials"})
        }
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//API to get all doctors list for admin panel

const allDoctors = async (req,res) => {
    
    try {
        const doctors = await doctorModel.find({}).select('-password')

        res.json({success:true,doctors})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//API to get All appointment list

const appointmentAdmin = async (req,res) => {
    try {
        const appointments = await appointmentModel.find({})
        res.json({success:true,appointments})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//API for appointment cancellation

const appointmentCancel = async (req,res) => {
    try {
        
        const {appointmentId} = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})

        //releasing doctor slot

        const {docId,slotData,slotTime} = appointmentData

        const doctorData = await doctorModel.findById(docId)

        let slot_booked = doctorData.slot_booked
        // console.log(slot_booked)
        slot_booked[slotData] = slot_booked[slotData].filter((e) => e!== slotTime)
        // console.log(slot_booked)
        await doctorModel.findByIdAndUpdate(docId,{ slot_booked })
        
        await appointmentModel.findByIdAndUpdate(
            appointmentId,
            { $set: { "docData.slot_booked": slot_booked } },  // ✅ Correct way to update nested object
            { new: true } // ✅ Ensures you get the updated document
          );
          const up = await appointmentModel.findById(appointmentId)
        // console.log(up)
        
        
        res.json({success:true,message:"appointment cancelled"})
    } catch (error) {
        console.log(error)
        return res.json({ success: false, message: error.message });
    }
}

//API to get dashboard data for admin panel

const adminDashboard = async (req,res) => {
    try {
        
        const doctors = await doctorModel.find({})
        const users = await userModel.find({})
        const appointments = await appointmentModel.find({})

        const dashData = {
            doctors:doctors.length,
            appointments:appointments.length,
            patients:users.length,
            latestAppointments:appointments.reverse().slice(0,5)
        }

        res.json({success:true,dashData})

    } catch (error) {
        console.log(error)
        return res.json({ success: false, message: error.message });
    }
}

export {
    addDoctor,
    loginAdmin,
    allDoctors,
    appointmentAdmin,
    appointmentCancel,
    adminDashboard,
    addMedicine,
    medicineList,
}