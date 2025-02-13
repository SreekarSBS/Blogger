import mongoose from "mongoose";

export const ConnectDB = async()=>{
    await mongoose.connect('mongodb+srv://sbssreekar:family%402004@cluster0.lpi3d.mongodb.net/');
    console.log("DB Connected");
}