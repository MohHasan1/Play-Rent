import { Request, Response, NextFunction } from "express";
import winston from "winston";

function logFn(req: Request, _: Response, next: NextFunction) {
  winston.info(req.method, req.url);
  next();
}

export default logFn;
