import bcrypt from 'bcrypt'
import userModel from '../models/user.models.js'
import validator from 'validator'
import jwt from 'jsonwebtoken'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from '../models/doctor.models.js'
import appointmentModel from '../models/appointment.models.js'
import {createCanvas} from 'canvas'
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
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
const generateResponse = async (req, res) => {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [
                    {
                        role: "user",
                        parts: [
                            {
                                text: `Provide the most recently spreading viral disease in India based strictly on **WHO India** reports.  

                                Return ONLY JSON in the exact format below, with no extra text or explanation:  
                                \`\`\`json
                                {
                                    "disease": "Disease Name",
                                    "infected": 1250000,
                                    "deaths": 12500,
                                    "precautions": [
                                        "Precaution 1",
                                        "Precaution 2",
                                        "Precaution 3"
                                    ],
                                    "cure": [
                                        "Treatment 1",
                                        "Treatment 2",
                                        "Treatment 3"
                                    ]
                                }
                                \`\`\`  

                                IMPORTANT RULES:
                                - **Do NOT add any extra text** before or after the JSON. Only return valid JSON.  
                                - If WHO India has no exact data, **estimate the numbers based on the latest WHO report.**  
                                - Do NOT return "I am unable to find data". Always return the best estimated values.  
                                - Ignore older outbreaks like COVID-19 unless there is a major resurgence.  
                                - **Precautions** should be practical steps people can take to avoid infection.  
                                - **Cure** should be medical treatments or remedies recommended by WHO.`
                            }
                        ]
                    }
                ]
            })
        });

        const data = await response.json();
        let modelResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

        // Extract JSON safely
        try {
            modelResponse = modelResponse.replace(/```json|```/g, "").trim(); // Remove markdown code blocks
            const jsonData = JSON.parse(modelResponse);

            // Validate if required fields exist
            if (!jsonData.disease || !jsonData.infected || !jsonData.deaths || !jsonData.precautions || !jsonData.cure) {
                throw new Error("Invalid JSON format received.");
            }

            // Ensure precautions and cure are properly formatted as lists
            jsonData.precautions = typeof jsonData.precautions === "string" 
                ? jsonData.precautions.includes(".") 
                    ? jsonData.precautions.split(/(?<=\.)\s+/)  // Split by sentence if periods exist
                    : jsonData.precautions.split(/(?=[A-Z])/)   // Split by capital letters if no periods
                : jsonData.precautions;

            jsonData.cure = typeof jsonData.cure === "string" 
                ? jsonData.cure.includes(".") 
                    ? jsonData.cure.split(/(?<=\.)\s+/) 
                    : jsonData.cure.split(/(?=[A-Z])/) 
                : jsonData.cure;

            return res.json({ success: true, data: jsonData });
        } catch (parseError) {
            console.error("Error parsing JSON:", parseError);
            return res.status(500).json({ success: false, message: "Invalid JSON response from Gemini." });
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

const chatbotResponse = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ success: false, message: "No symptoms provided" });
        }

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `User symptoms: ${message}. Predict only one most likely disease. Provide exactly 3 precaution points and 3 cure points. Also, suggest the type of doctor to consult. 
                        If the input is not related to medical diagnosis, respond ONLY in valid JSON format:
                        {
                            "error": "Input not related to medical diagnosis"
                        } 
                        Otherwise, respond ONLY in valid JSON format:
                        {
                            "disease": "",
                            "precaution": ["", "", ""],
                            "cure": ["", "", ""],
                            "recommendedDoctor": ""
                        }`
                    }]
                }]
            }),
        });

        const data = await response.json();

        if (!data?.candidates?.length) {
            return res.json({ success: false, message: "Failed to generate a response" });
        }

        let rawText = data.candidates[0].content.parts[0].text.trim();
        rawText = rawText.replace(/```json|```/g, "").trim();

        try {
            const diagnosis = JSON.parse(rawText);
            if (diagnosis.error) {
                return res.json({ success: false, message: diagnosis.error });
            }

            return res.json({
                success: true,
                response: diagnosis
            });
        } catch (jsonError) {
            console.error("JSON Parsing Error:", jsonError);
            return res.json({ success: false, message: "Input not related to medical diagnosis" });
        }

    } catch (error) {
        console.error(error);
        return res.json({ success: false, message: "Server error occurred." });
    }
};
//API to get verify user is submitted lab report or not
const verifyLab = async (req, res) => {
    try {
        const { userId } = req.body;
        const userData = await userModel.findById(userId); // Use findById instead of find

        if (!userData) {
            return res.json({ success: false, message: "User not found" });
        }

        const labFile = userData.labFile;
        if (!labFile) {
            return res.json({ success: false, message: "Lab file not found" });
        }

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        return res.json({ success: false, message: "Server error occurred." });
    }
};

const generateAndSavePrescription = async (req, res) => {
    try {
      const { userId, docId, prescriptionDetails } = req.body;
  
      // Fetch doctor details
      const doctor = await doctorModel.findById(docId);
      if (!doctor) {
        return res.status(404).json({ error: "Doctor not found" });
      }
  
      // Fetch user details (patient)
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      // Step 1: Create Prescription Template
      const canvas = createCanvas(800, 1000);
      const ctx = canvas.getContext("2d");
  
      // Background
      ctx.fillStyle = "#F0F0F0"; // Light gray background
      ctx.fillRect(0, 0, canvas.width, canvas.height);
  
      // Header (Blue with Medical Icon)
      ctx.fillStyle = "#3B5CCC"; // Blue
      ctx.fillRect(0, 0, canvas.width, 100);
  
      // Medical Cross Icon (White Circle with Blue Cross)
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(700, 50, 40, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#3B5CCC"; // Blue cross
      ctx.fillRect(680, 40, 40, 15);
      ctx.fillRect(690, 30, 15, 40);
  
      // Clinic & Doctor Details (Placed Below the Blue Header)
      let y = 130;
      ctx.fillStyle = "black";
      ctx.font = "22px Arial";
      ctx.fillText("prescripto clinic", 50, y);
      ctx.fillText(doctor.address.line1 || "Clinic Address", 50, (y += 30));
  
      ctx.font = "20px Arial";
      ctx.fillText(`Dr. ${doctor.name}, ${doctor.speciality}`, 50, (y += 40));
  
      // Date
      y += 40;
      ctx.fillStyle = "blue";
      ctx.font = "bold 20px Arial";
      ctx.fillText(`Date: ${new Date().toDateString()}`, 50, y);
  
      // Patient Details
      y += 40;
      ctx.fillStyle = "black";
      ctx.font = "18px Arial";
      ctx.fillText(`Patient Name: ${user.name}`, 50, y);
      ctx.fillText(`Date of Birth: ${user.dob || "N/A"}`, 50, (y += 30));
      ctx.fillText(`Address: ${user.address.line1 || "N/A"}`, 50, (y += 30));
  
      // Prescription Section Title
      y += 50;
      ctx.fillStyle = "blue";
      ctx.font = "bold 20px Arial";
      ctx.fillText("Prescription", 50, y);
  
      // Prescription Content (Properly Spaced)
      y += 40;
      ctx.fillStyle = "black";
      ctx.font = "18px Arial";
      ctx.fillText(`Medication: ${prescriptionDetails.medication}`, 50, y);
      ctx.fillText(`Dosage: ${prescriptionDetails.dosage}`, 50, (y += 35));
      ctx.fillText(`Quantity: ${prescriptionDetails.quantity}`, 50, (y += 35));
      ctx.fillText(`Refills: ${prescriptionDetails.refills}`, 50, (y += 35));
  
      // Signature Section
      ctx.font = "italic 18px Arial";
      ctx.fillText("Signature", 600, 920);
      ctx.fillStyle = "#3B5CCC";
      ctx.fillRect(590, 930, 120, 2);
      ctx.fillStyle = "black";
      ctx.fillText(`Dr. ${doctor.name}`, 610, 960);
  
      // Convert Canvas to Buffer
      const imageBuffer = canvas.toBuffer("image/jpeg");
  
      // Step 2: Upload Image to Cloudinary
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { resource_type: "image", format: "jpg" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(imageBuffer);
      });
  
      if (!result.secure_url) {
        return res.status(500).json({ error: "Failed to upload prescription image" });
      }
  
      // Step 3: Save Image URL to MongoDB (Linked to User)
      await userModel.findByIdAndUpdate(userId, { prescription: result.secure_url });
  
      return res.status(200).json({
        success:true,
        message: "Prescription generated and saved successfully",
        imageUrl: result.secure_url,
      });
  
    } catch (error) {
      console.error("Error generating prescription:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
 const getUserId = async (req,res) => {
    try {
        const {email} = req.body;
        const user = await userModel.findOne({email})
        if(!user){
            return res.json({success:false,message:"user id not fetched"})
        }
        const userId = user._id;
        return res.json({success:true,userId})
        
    } catch (error) {
        console.error("Error generating prescription:", error);
      return res.status(500).json({ error: "Internal Server Error" }); 
    }
 }

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
    generateResponse,
    chatbotResponse,
    verifyLab,
    generateAndSavePrescription,
    getUserId
}