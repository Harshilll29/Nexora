import mongoose from 'mongoose';

export const connectDB = async () =>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`MOngoDB Connected: ${mongoose.connection.host}`);
    }catch(error){
        console.log("Error connecting to MongoDB:", error);
        process.exit(1); // Exit process with failure 1 means there was an error
    }
}