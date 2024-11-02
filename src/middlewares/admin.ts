import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";

// Define a custom type for the user payload
interface UserPayload extends JwtPayload {
  _id: string; // Add other properties as per your JWT payload
  isAdmin?: boolean
}

// use it after auth or will not work !!!
function admin(
  req: Request & { user?: UserPayload },
  res: Response,
  next: NextFunction
) {
  // user is added in auth func after checking the token !! 
  if (!req.user?.isAdmin) {
    // forbidden
    res.status(403).send("Access denied");
    return;
  }

  next();
}

export default admin;

// 400 bad req
// 401 unauthorized - u may try again
// 403 forbidden - don't try again u r not allowed
// 404 not found
