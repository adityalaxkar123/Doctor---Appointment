import mongoose from 'mongoose'

const connectDB = async()=>{
    try {
        mongoose.connection.on('connected',()=> console.log('Database connected'));
        await mongoose.connect(`${process.env.MONGODB_URI}/prescripto`)
    } catch (error) {
        throw error
    }
}

export default connectDB