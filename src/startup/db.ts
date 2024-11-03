import mongoose from "mongoose";
import logger from "../utils/logger";

const dbConnect = () => {
  logger.info("Node Env: " + process.env.NODE_ENV);
  const URL =
    process.env.NODE_ENV === "test"
      ? process.env.TEST_MONGO_DB_URL
      : process.env.MONGO_DB_URL;

  mongoose
    .connect(URL!)
    .then(() => logger.info("Connected to MongoDB - " + URL));
  // .catch(() => logger.info("Failed to connect..."));
};

export default dbConnect;
