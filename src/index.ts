import express from "express";
import dotenv from "dotenv";
import routes from "./startup/routes";
import dbConnect from "./startup/db";
import config from "./startup/config";
import logger from "./utils/logger";
import ExceptionHandlers from "./startup/exceptionHandlers";

dotenv.config();
const app = express();

ExceptionHandlers();
config();
dbConnect();
routes(app);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  logger.info(`Server running on port: ${PORT}`);
});

export { app, server };
