import mongoose from "mongoose"

const connectDB=async ()=>{
    try {
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}${process.env.DB_NAME}`)
        console.log("Connected to DB at: ",connectionInstance.connection.host,':',connectionInstance.connection.port)
    } catch (error) {
        console.log("failed to connect to DB",error)
    }
}

export default connectDB