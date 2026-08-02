import mongoose from "mongoose";
import config from "../config/index.js";

const connectDB = async () => {
  await mongoose.connect(config.mongoUri);

  console.log(`MongoDB connected: ${mongoose.connection.name}`);
};

export default connectDB;
