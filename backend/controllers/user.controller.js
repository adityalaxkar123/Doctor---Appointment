import bcrypt from 'bcrypt'
import userModel from '../models/user.models.js'
import validator from 'validator'
import jwt from 'jsonwebtoken'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from '../models/doctor.models.js'
import appointmentModel from '../models/appointment.models.js'

//API to register user


const registerUser = async(req,res)=>{
    try {
        const {name,email,password} = req.body
        if (!name || !password || !email) {
            return res.json({success:false,message:'missing details'})
        }
        if(!validator.isEmail(email)){
            return res.json({success:false,message:'enter a valid email'})
        }

        if(password.length < 8){
            return res.json({success:false,message:'enter a strong password'})
        }
        //hashing user password
        const salt = await bcrypt.genSalt(10) 
        const hashedPassword = await bcrypt.hash(password,salt)

        const userData = {
            name,
            email,
            password:hashedPassword,
        }

        const newUser = await userModel(userData)

        const user = await newUser.save();
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET)

        res.json({success:true,token})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}
//API for user login

const loginUser = async(req,res)=>{
    try {
        const {email,password} = req.body
        const user = await userModel.findOne({email})
        if(!user){
            return res.json({success:false,message:'user does not exist'})
        }

        const isMatch = await bcrypt.compare(password,user.password)

        if(isMatch){
           const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
           res.json({success:true,token}) 
        }else{
            res.json({success:false,message:"invalid credentials"})
        }

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}
//API for getuser data

const getProfile = async (req,res) => {
    try {
        const {userId} = req.body

        const userData = await userModel.findById(userId).select('-password')

        res.json({success:true,userData})

    } catch (error) {
        console.log(error)
        return res.json({success:false,message:error.message})
    }
}

//API for update profile

const updateProfile = async (req, res) => {
    try {
        const { userId, name, phone, address, dob, gender } = req.body;
        const imageFile = req.files?.image?.[0] || null;
        const labFile = req.files?.labFile?.[0] || null;

        if (!name || !phone || !dob || !gender) {
            return res.json({ success: false, message: 'Data missing' });
        }

        await userModel.findByIdAndUpdate(userId, {
            name,
            phone,
            address: JSON.parse(address),
            dob,
            gender
        });

        // Upload Lab Report as an Image
        if (labFile) {
            const labUpload = await cloudinary.uploader.upload(labFile.path, {
                resource_type: "image", // Changed from raw to image
                folder: "lab_reports", // Optional: Stores in 'lab_reports' folder
            });

            const labUrl = labUpload.secure_url;
            // console.log("Lab Report Image URL:", labUrl);
            await userModel.findByIdAndUpdate(userId, { labFile: labUrl });
        }

        // Upload Profile Image
        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
                resource_type: "image",
                folder: "profile_images", // Optional: Stores in 'profile_images' folder
            });

            const imageUrl = imageUpload.secure_url;
            // console.log("Profile Image URL:", imageUrl);
            await userModel.findByIdAndUpdate(userId, { image: imageUrl });
        }

        res.json({ success: true, message: "Profile updated successfully!" });

    } catch (error) {
        console.error(error);
        return res.json({ success: false, message: error.message });
    }
};

//API to book an appointment

const bookAppointment = async (req, res) => {
    try {
        const { userId, docId, slotData, slotTime } = req.body;

        // Check if the slot is already booked by any user
        const existingSlot = await appointmentModel.findOne({
            docId,
            slotData,
            slotTime,
            [`docData.slot_booked.${slotData}`]: slotTime,
        });

        if (existingSlot) {
            return res.json({ success: false, message: "Slot already booked by another user." });
        }

        // Fetch doctor data
        const docData = await doctorModel.findById(docId).select('-password');

        if (!docData.available) {
            return res.json({ success: false, message: "Doctor not available" });
        }

        let slot_booked = docData.slot_booked;

        // Check for slot availability
        if (slot_booked[slotData]) {
            if (slot_booked[slotData].includes(slotTime)) {
                return res.json({ success: false, message: "Slot already booked by another user." });
            } else {
                slot_booked[slotData].push(slotTime);
            }
        } else {
            slot_booked[slotData] = [slotTime];
        }

        const userData = await userModel.findById(userId).select('-password');

        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount: docData.fees,
            slotTime,
            slotData,
            date: Date.now()
        };

        const newAppointment = new appointmentModel(appointmentData);
        await newAppointment.save();

        // Save updated slot data in doctor model
        await doctorModel.findByIdAndUpdate(docId, { slot_booked });

        res.json({ success: true, message: "Appointment booked successfully" });

    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
};

//api to get user appointment for frontend my-appointment page

const listAppointment = async (req,res) => {
    try {
        const {userId} = req.body
        const appointments = await appointmentModel.find({userId})


        res.json({success:true,appointments})
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
}

//API to cancel appointment

const cancelAppointment = async (req,res) => {
    try {
        
        const {userId,appointmentId} = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        // verify appointment user

        if(appointmentData.userId !== userId){
            return res.json({success:false,message:"unauthorized action"})
        }

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

// const razorpayInstance = new razorpay({
//     key_id:process.env.RAZORPAY_ID,
//     key_secret:process.env.RAZORPAY_SECRET
// })


//API to make payment of appointment using razorpay


// const paymentRazorpay = async (req,res) => {
// try {
//         const {appointmentId} = req.body
    
//         const appointmentData = await appointmentModel.findById(appointmentId)
    
//         if(!appointmentData || appointmentData.cancelled == true){
//             return res.json({success:false,message:"Appointment cancelled or not found"})
//         }
    
//         // creating options for razorpay Payments
    
//         const options = {
//             amount:appointmentData.amount * 100,
//             currency:process.env.CURRENCY,
//             receipt:appointmentId,
//         }
    
//         // creation of an order
    
//         const order = await razorpayInstance.orders.create(options)
    
//         res.json({success:true,order})
    
// } catch (error) {
//     console.log(error)
//     return res.json({ success: false, message: error.message });
// }
// }


const paymentRazorpay = async (req, res) => {
    try {
        const { appointmentId } = req.body;

        // Fetch appointment data from database
        const appointmentData = await appointmentModel.findById(appointmentId);

        if (!appointmentData || appointmentData.cancelled) {
            return res.json({ success: false, message: "Appointment cancelled or not found" });
        }

        // Dummy Razorpay-like response
        const dummyOrder = {
            id: `order_${Date.now()}`,
            entity: "order",
            amount: appointmentData.amount * 100, // Convert to paise
            currency: "INR",
            receipt: appointmentId,
            status: "created"
        };

        res.json({ success: true, order: dummyOrder });

    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
};

// API to verify payment of razorpay
// const verifyRazorpay = async (req,res) => {
//     try {
//         const {razorpay_order_id} = req.body
//         const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)

//         console.log(orderInfo)
//     } catch (error) {
        
//     }
// }
const verifyRazorpay = async (req, res) => {
    try {
        const { razorpay_order_id,razorpay_appointment,razorpay_payment } = req.body;

        // Simulating a successful order fetch response
        const dummyOrderInfo = {
            id: razorpay_order_id,
            entity: "order",
            amount: razorpay_payment, // ₹500 in paise
            currency: "INR",
            status: "paid",
            created_at: Date.now(),
        };

        // console.log("Order Verification:", dummyOrderInfo);
        if(dummyOrderInfo.status === 'paid'){
            await appointmentModel.findByIdAndUpdate(razorpay_appointment,{payment:true})
            res.json({ success: true,message: "Payment verified successfully!" });
        }else{
        res.json({ success: false, message: "Payment verification failed!" });
            
        }

    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
};

export{
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
    bookAppointment,
    listAppointment,
    cancelAppointment,
    paymentRazorpay,
    verifyRazorpay,
}