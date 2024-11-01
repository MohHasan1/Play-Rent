// import "express-async-errors";
import logger from "../utils/logger";

const ExceptionHandlers = () => {
  process.on("uncaughtException", (ex) => {
    logger.info("uncaughtException:" + ex.message, ex);
    // stop the process
    // process.exit(1);
    // restart the node - clean state
  });
  process.on("unhandledRejection", (ex: any) => {
    logger.info("unhandledRejection:" + ex.message, ex);
    // stop the process
    // process.exit(1);
    // restart the node - clean state
  });
};

export default ExceptionHandlers;
