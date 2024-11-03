import { Types } from "mongoose";
import { Request, Response, NextFunction } from "express";

function validateObjectId(req: Request, res: Response, next: NextFunction) {
  if (!Types.ObjectId.isValid(req.params.id)) {
    res.status(404).send("Invalid Id");
  }

  next()
}

export default validateObjectId;
