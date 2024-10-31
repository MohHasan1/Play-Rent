import { Request, Response, NextFunction } from "express";
import { JwtPayload, verify } from "jsonwebtoken";

// Define a custom type for the user payload
interface UserPayload extends JwtPayload {
  _id: string; // Add other properties as per your JWT payload
}

// use it after auth or no work
function auth(
  req: Request & { user?: UserPayload },
  res: Response,
  next: NextFunction
) {
  if (!req?.user?.isAdmin) {
    // forbidden
    res.status(403).send("Access denied");
    return;
  }

  next();
}

export default auth;

// 400 bad req
// 401 unauthorized - u may try again
// 403 forbidden - dont try again u r not allowed
// 404 not found
