import mongoose,{Schema} from 'mongoose'

const orderSchema = new Schema({
    userId:{
        type:String,
        required:true
    },
userData:{
    type:Object,
    required:true
},
medData:{
type:Object,
required:true
},
mg:{
    type:Number,
    default:0
},
ml:{
    type:Number,
    default:0
},
orderPlaced:{
    type:Boolean,
    default:false
},
orderDelivered:{
type:Boolean,
default:false
},
address:{
    type:String,
    required:true
},
phone:{
    type:Number,
    required:true
},
paymentStatus:{
    type:Boolean,
    default:false
},
orderDate:{
    type:String,
    default:"00-00-0000"
}
})

const orderModel = mongoose.models.order || mongoose.model('order',orderSchema)

export default orderModel