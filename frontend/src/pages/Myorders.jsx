import { useContext, useEffect, useState } from "react"
import {AppContext} from '../context/AppContext'
import axios from "axios"
import {useNavigate} from 'react-router-dom'
import { toast } from "react-toastify"
const MyOrders = () => {
 const {backendUrl,token,getMedicineData} = useContext(AppContext)
const navigate = useNavigate()

 const [orders,setOrder] = useState([])
 
  const getUserOrder = async () => {
    try {
      const {data} = await axios.get(backendUrl + '/api/user/userOrder',{headers:{token}})
      if (data.success) {
        setOrder(data.order.reverse())
    //   console.log(data.order)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

const cancelOrder = async (orderId) => {
  try {
    // console.log(appointmentId)
    const {data} = await axios.post(backendUrl + '/api/user/cancel-order',{orderId},{headers:{token}})

    if(data.success){
      toast.success(data.message)
      getUserOrder()
      getMedicineData()
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


const initPay = (medOrder) => {
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
      <p class="text-xl font-bold text-center mt-2">₹${medOrder.amount} ${medOrder.currency}</p>

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
  document.body.appendChild(paymentModal);
  document.getElementById("closeModal").addEventListener("click", () => document.body.removeChild(paymentModal));
  document.getElementById("cancelPay").addEventListener("click", () => {
    document.body.removeChild(paymentModal);
    toast.error("Payment Cancelled");
  });

  document.getElementById("payNow").addEventListener("click", async () => {
    document.getElementById("payNow").classList.add("hidden");
    document.getElementById("cancelPay").classList.add("hidden");
    document.getElementById("paymentLoader").classList.remove("hidden");

    setTimeout(async () => {
      document.body.removeChild(paymentModal);
      const response = {
        razorpay_payment_id: "pay_" + Math.floor(Math.random() * 1000000),
        razorpay_order_id: medOrder.id,
        razorpay_signature: "dummy_signature_123456",
        razorpay_order: medOrder.receipt,
        razorpay_payment: medOrder.amount,
      };

      console.log("Payment Successful:", response);
      toast.success("Payment successful");
      try {
        const { data } = await axios.post(backendUrl + "/api/user/verify-medOrderRazorpay", response, { headers: { token } });
        console.log("Verification Response:", data);
        if (data.success) {
          getUserOrder();
          navigate('/my-orders');
          toast.success("Payment Verified Successfully");
        } else {
          toast.error("Payment Verification Failed");
        }
      } catch (error) {
        console.log(error);
        toast.error("Error verifying payment");
      }
    }, 2500);
  });
};




const orderRazorpay = async (orderId)=>{
  try {
    const {data} = await axios.post(backendUrl + '/api/user/payment-orderRazorpay',{ orderId },{headers:{token}})
    if(data.success){
      // console.log(data.order)
      initPay(data.medOrder)
    }
  } catch (error) {
    console.log(error)
  }
}


useEffect(()=>{
  if(token){
    getUserOrder()
  }
},[token])
  return orders && (
    <div>
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">My appointments</p>
      <div>
        {
          orders.map((item,index)=>(
            <div
            className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b"
             key={index}>
              <div>
                <img
                 className="w-32 bg-indigo-50"
                 src={item.medData.image} alt="" />
              </div>
              <div className="flex-1 text-sm text-zinc-600">
                <p className="text-neutral-800 font-semibold ">Medicine:  <span className="ml-1">{item.medData.name}</span></p>
                <p>₹{item.medData.price}</p>
                <p className="text-xs mt-1"><span className="text-sm text-neutral-700 font-medium">Date & Time: </span> {item.orderDate}</p>
                <p className="text-neutral-800 font-semibold mt-1">Address:<span className="ml-1">{item.address}</span></p>
              </div>
              <div></div>
              <div className="flex flex-col gap-2 justify-end">
              {item.orderPlaced && item.paymentStatus &&
              <button className="sm-min-w-48 py-2 border rounded text-stone-500 bg-indigo-50">Paid</button>
              }
                {item.orderPlaced &&
                !item.paymentStatus &&
                !item.orderDelivered &&
                <button
                onClick={()=> orderRazorpay(item._id)}
                 className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300">Pay Online</button>
                }
               {item.orderPlaced &&
                !item.orderDelivered && 
                <button onClick={()=> cancelOrder(item._id)} className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded  hover:bg-red-600 hover:text-white transition-all duration-300">Cancel Order</button>
               } 
               {!item.orderPlaced && 
               <button className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500">Order cancelled</button>
               }
               {
                item.orderDelivered && 
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

export default MyOrders
