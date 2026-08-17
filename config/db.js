import mongoose from "mongoose";

const RETRY_DELAY_MS = 5000;

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not set");
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    console.log(`Retrying MongoDB connection in ${RETRY_DELAY_MS / 1000}s...`);
    setTimeout(connectDB, RETRY_DELAY_MS);
  }
};

export default connectDB;