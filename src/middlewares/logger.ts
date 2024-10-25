import { Request, Response, NextFunction } from "express";

function logFn(req: Request, _: Response, next: NextFunction) {
  console.log(req.method, req.url);
  next();
}

export default logFn;
