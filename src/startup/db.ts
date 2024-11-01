import mongoose from "mongoose";
import logger from "../utils/logger";

const dbConnect = () => {
  mongoose
    .connect(process.env.MONGO_DB_URL!)
    .then(() => logger.info("Connected to MongoDB - PlayRent..."));
  // .catch(() => logger.info("Failed to connect..."));
};

export default dbConnect;
