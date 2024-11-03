import logger from "../utils/logger";

const config = () => {
  // if JWT_SECRET is not set
  if (!process.env.JWT_SECRET) {
    logger.error("FATAL ERROR: No JWT_SECRET Key");
    throw new Error("FATAL ERROR: No JWT_SECRET Key");
  }
  if (!process.env.MONGO_DB_URL) {
    logger.error("FATAL ERROR: No MongoDB Url");
    throw new Error("FATAL ERROR: No MongoDB Url");
  }
};

export default config;
