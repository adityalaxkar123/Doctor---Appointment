import { useContext, useEffect, useState } from "react"
import {AppContext} from '../context/AppContext'
import axios from "axios"
import {useNavigate} from 'react-router-dom'
import { toast } from "react-toastify"
const MyAppointments = () => {
 const {backendUrl,token,getDoctorsData} = useContext(AppContext)
const navigate = useNavigate()
const months = ['','Jan','Feb','Mar','Apr','May','Jun','July','Aug','Sep','Oct','Nov','Dec']

const slotDateFormat = (slotData)=>{
  const dateArray = slotData.split('_')
  return dateArray[0]+" "+ months[Number(dateArray[1])] + ", " + dateArray[2]
}

 const [appointments,setAppointment] = useState([])
 
  const getUserAppointment = async () => {
    try {
      const {data} = await axios.get(backendUrl + '/api/user/appointments',{headers:{token}})
      if (data.success) {
        setAppointment(data.appointments.reverse())
      // console.log(data.appointments)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

const cancelAppointment = async (appointmentId) => {
  try {
    // console.log(appointmentId)
    const {data} = await axios.post(backendUrl + '/api/user/cancel-appointment',{appointmentId},{headers:{token}})

    if(data.success){
      toast.success(data.message)
      getUserAppointment()
      getDoctorsData()
    }else{
      toast.error(data.message)
    }
  } catch (error) {
    console.log(error)
      toast.error(error.message)
  }
}

// const initPay = (order)=>{
//   const options = {
//     key:import.meta.env.VITE_RAZORPAY_ID,
//     amount:order.amount,
//     currency: order.currency,
//     name: "appointment payment",
//     description: "appointment payment",
//     order_id:order.id,
//     receipt:order.receipt,
//     handler: async (response) => {
//       console.log(response)
//     }
//   }

//   const rzp = new window.Razorpay(options)
//   rzp.open()

// }



const initPay = (order) => {
  // Create the modal container
  const paymentModal = document.createElement("div");
  paymentModal.className = "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50";

  // Modal content
  paymentModal.innerHTML = `
    <div class="bg-white p-6 rounded-lg shadow-lg w-96 font-sans relative animate-fadeIn">
      <!-- Close button -->
      <button id="closeModal" class="absolute top-2 right-3 text-gray-500 text-xl">&times;</button>

      <!-- Razorpay Branding -->
      <img src="https://cdn.iconscout.com/icon/free/png-256/free-razorpay-logo-icon-download-in-svg-png-gif-file-formats--payment-gateway-brand-logos-icons-1399875.png" 
        alt="Razorpay" class="w-36 mx-auto mb-2 h-28">

      <!-- Payment Details -->
      <h2 class="text-blue-600 text-lg font-semibold text-center">Complete Your Payment</h2>
      <p class="text-gray-600 text-sm text-center">Pay securely with Razorpay</p>
      <p class="text-xl font-bold text-center mt-2">₹${order.amount / 100} ${order.currency}</p>

      <!-- Card Number -->
      <input type="text" id="cardNumber" placeholder="Card Number" maxlength="16" 
        class="w-full border border-gray-300 rounded-md p-2 text-center mt-4 text-lg focus:outline-blue-500">

      <!-- Expiry & CVV -->
      <div class="flex gap-3 mt-3">
        <input type="text" id="expiryDate" placeholder="MM/YY" maxlength="5" 
          class="w-1/2 border border-gray-300 rounded-md p-2 text-center text-lg focus:outline-blue-500">
        <input type="text" id="cvv" placeholder="CVV" maxlength="3" 
          class="w-1/2 border border-gray-300 rounded-md p-2 text-center text-lg focus:outline-blue-500">
      </div>

      <!-- Phone Number -->
      <input type="text" id="phoneNumber" placeholder="Phone Number" maxlength="10" 
        class="w-full border border-gray-300 rounded-md p-2 text-center mt-3 text-lg focus:outline-blue-500">

      <!-- Buttons -->
      <button id="payNow" class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md mt-4 font-semibold">
        Pay Now
      </button>
      <button id="cancelPay" class="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md mt-2 font-semibold">
        Cancel
      </button>

      <!-- Loader -->
      <div id="paymentLoader" class="hidden mt-4 text-gray-600 text-center">
        <div class="animate-spin h-6 w-6 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
        Processing payment...
      </div>
    </div>
  `;

  // Append modal to body
  document.body.appendChild(paymentModal);

  // Close modal on cancel
  document.getElementById("closeModal").addEventListener("click", () => document.body.removeChild(paymentModal));
  document.getElementById("cancelPay").addEventListener("click", () => {
    document.body.removeChild(paymentModal);
    toast.error("Payment Cancelled");
  });

  // Handle fake payment success
  document.getElementById("payNow").addEventListener("click", async () => {
    document.getElementById("payNow").classList.add("hidden");
    document.getElementById("cancelPay").classList.add("hidden");
    document.getElementById("paymentLoader").classList.remove("hidden");

    setTimeout(async () => {
      document.body.removeChild(paymentModal);

      // Simulated Razorpay payment response
      const response = {
        razorpay_payment_id: "pay_" + Math.floor(Math.random() * 1000000),
        razorpay_order_id: order.id,
        razorpay_signature: "dummy_signature_123456",
        razorpay_appointment: order.receipt,
        razorpay_payment: order.amount,
      };

      console.log("Payment Successful:", response);
      toast.success("Payment successful");

      // Call backend to verify the payment
      try {
        const { data } = await axios.post(backendUrl + "/api/user/verify-razorpay", response, { headers: { token } });
        console.log("Verification Response:", data);
        if (data.success) {
          getUserAppointment();
          navigate('/my-appointment');
          toast.success("Payment Verified Successfully");
        } else {
          toast.error("Payment Verification Failed");
        }
      } catch (error) {
        console.log(error);
        toast.error("Error verifying payment");
      }
    }, 2500); // Fake loading delay
  });
};




const appointmentRazorpay = async (appointmentId)=>{
  try {
    const {data} = await axios.post(backendUrl + '/api/user/payment-razorpay',{appointmentId},{headers:{token}})
    if(data.success){
      // console.log(data.order)
      initPay(data.order)
    }
  } catch (error) {
    console.log(error)
  }
}


useEffect(()=>{
  if(token){
    getUserAppointment()
  }
},[token])
  return (
    <div>
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">My appointments</p>
      <div>
        {
          appointments.map((item,index)=>(
            <div
            className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b"
             key={index}>
              <div>
                <img
                 className="w-32 bg-indigo-50"
                 src={item.docData.image} alt="" />
              </div>
              <div className="flex-1 text-sm text-zinc-600">
                <p className="text-neutral-800 font-semibold ">{item.docData.name}</p>
                <p>{item.docData.speciality}</p>
                <p className="text-neutral-800 font-semibold mt-1">Address:</p>
                <p className="text-xs">{item.docData.address.line1}</p>
                <p className="text-xs">{item.docData.address.line2}</p>
                <p className="text-xs mt-1"><span className="text-sm text-neutral-700 font-medium">Date & Time: </span> {slotDateFormat(item.slotData)} | {item.slotTime}</p>
              </div>
              <div></div>
              <div className="flex flex-col gap-2 justify-end">
              {!item.cancelled && item.payment &&
              <button className="sm-min-w-48 py-2 border rounded text-stone-500 bg-indigo-50">Paid</button>
              }
                {!item.cancelled && 
                !item.payment &&
                !item.isCompleted &&
                <button
                onClick={()=> appointmentRazorpay(item._id)}
                 className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300">Pay Online</button>
                }
               {!item.cancelled && 
                !item.isCompleted &&
                <button onClick={()=> cancelAppointment(item._id)} className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded  hover:bg-red-600 hover:text-white transition-all duration-300">Cancel appointment</button>
               } 
               {item.cancelled && 
                !item.isCompleted &&
               <button className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500">Appointment cancelled</button>
               }
               {
                item.isCompleted && 
                <button
                className="sm:min-w-48 py-2 border border-green-500 text-green-500"
                >Completed</button>
               }
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default MyAppointments
