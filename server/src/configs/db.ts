import mongoose from "mongoose";
import * as dotenv from "dotenv";
import log4js from "log4js";
dotenv.config();
mongoose.set("strictQuery", true);

const logger = log4js.getLogger();
const MONGO_URI = process.env.MONGO_URI!;

async function connectDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    logger.log("Connected to Database");
  } catch (error) {
    logger.error("Could not connect to the database", error);
  }
}

export default connectDatabase;
