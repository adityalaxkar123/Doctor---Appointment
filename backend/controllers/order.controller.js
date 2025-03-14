import orderModel from '../models/order.model.js'
import validator from'validator'
import userModel from '../models/user.models.js'

//API to take the order info from frontend

const orderFrontend = async(req,res)=>{
    try {
        const {mg,ml,address,userId,phone,medData,orderDate} = req.body
        if(!userId || !address || !phone ||!medData){
            res.json({success:false,message:"missing details"})
        }

       if(!validator.isMobilePhone(phone)){
        res.json({success:false,message:"invalid phone no. type"})
       }

       const userData = await userModel.findById(userId)
        const orderDetail = {
            userId,
            mg,
            ml,
            address,
            userData,
            medData,
            phone,
            orderPlaced:true,
            orderDate
        }
        const newOrder = await orderModel(orderDetail)
        await newOrder.save()

        res.json({success:true,message:"order placed"})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//API for get userorder

const getUserOrder = async (req,res) => {
    try {
        const {userId} = req.body

        const order = await orderModel.find({userId});

        return res.json({success:true,order})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

const cancelOrder = async (req,res) => {
    try {
        const {userId,orderId} = req.body

        const orderData = await orderModel.findById(orderId)

        if(orderData && orderData.userId === userId){
            await orderModel.findByIdAndUpdate(orderId,{orderPlaced:false})

            res.json({success:true,message:"order cancelled"})
        }else{
            res.json({success:false,message:"order cancellation failed"})
        }

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

const orderRazorpay = async (req, res) => {
    try {
        const { orderId,userId} = req.body;

        // Fetch order data from database
        const orderData = await orderModel.findById(orderId);
        // console.log(orderData)
        if (!orderData || !orderData.orderPlaced || !userId) {
            return res.json({ success: false, message: "Order cancelled or not found" });
        }

        // Dummy Razorpay-like response
        const dummyOrder = {
            id: `order_${Date.now()}`,
            entity: "order",
            amount:  orderData.medData.price, 
            currency: "INR",
            receipt: orderId,
            status: "created"
        };

        res.json({ success: true, medOrder: dummyOrder });

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
const verifyOrderRazorpay = async (req, res) => {
    try {
        const { razorpay_order_id,razorpay_order,razorpay_payment ,userId} = req.body;

        // Simulating a successful order fetch response
        const dummyOrderInfo = {
            id: razorpay_order_id,
            entity: "order",
            amount: razorpay_payment,
            currency: "INR",
            status: "paid",
            created_at: Date.now(),
        };

        // console.log("Order Verification:", dummyOrderInfo);
        if(dummyOrderInfo.status === 'paid' || userId){
            await orderModel.findByIdAndUpdate(razorpay_order,{paymentStatus:true})
            res.json({ success: true,message: "Payment verified successfully!" });
        }else{
        res.json({ success: false, message: "Payment verification failed!" });
            
        }

    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
};

//API for get all orders
const getAllOrders = async (req,res) => {
    try {
        const orders = await orderModel.find({})

        return res.json({success:true,orders})
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
}

//API for admin cancel order

const cancelAdminOrder = async (req, res) => {
    try {
        const { orderId } = req.body;

        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        await orderModel.findByIdAndUpdate(orderId, { orderPlaced: false });

        return res.json({ success: true, message: "Order cancelled" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message });
    }
};


const completeOrder = async (req,res) => {
    try {
        const {orderId} =req.body

        const order = await orderModel.findByIdAndUpdate(orderId,{orderDelivered:true})
        return res.json({success:true,message:"order completed"})
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
    
}
export{
    orderFrontend,
    getUserOrder,
    cancelOrder,
    orderRazorpay,
    verifyOrderRazorpay,
    getAllOrders,
    cancelAdminOrder,
    completeOrder
}