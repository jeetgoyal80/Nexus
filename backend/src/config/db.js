import mongoose from "mongoose";
import { env } from "./env.js";
import logger from "./logger.js";

export const connectDB = async () => {
  try {
    mongoose.set("strictQuery", true);

    await mongoose.connect(env.MONGO_URI);
    logger.info("MongoDB connected");
  } catch (error) {
    logger.error(`Database connection failed: ${error.message}`);
    process.exit(1);
  }
};
