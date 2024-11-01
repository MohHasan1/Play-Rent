
import { Request, Response, NextFunction } from "express";

type AsyncHandler = (req: Request, res: Response) => Promise<void>;

function asyncMiddleware(handler: AsyncHandler) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res);
    } catch (error) {
      next(error);
    }
  };
}

export default asyncMiddleware;
