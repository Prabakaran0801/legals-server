import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB is Successfully");
  } catch (error) {
    console.error(`MongoDB Error:  ${error.message}`);
  }
};

export default connectDB;
