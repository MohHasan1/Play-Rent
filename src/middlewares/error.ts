import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

function error(err: Error, _req: Request, res: Response, _next: NextFunction) {
  logger.error("Error middleware triggered: " + err);
  res.status(500).send("Something Failed Internally");
}

export default error;
