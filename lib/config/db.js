import mongoose from "mongoose";

export const ConnectDB = async()=>{
    await mongoose.connect('Your Mongo URL');
    console.log("DB Connected");
}
