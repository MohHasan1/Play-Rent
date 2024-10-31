import { Request, Response, NextFunction } from "express";
import { JwtPayload, verify } from "jsonwebtoken";

// Define a custom type for the user payload
interface UserPayload extends JwtPayload {
  _id: string;
  isAdmin: boolean;
}

function auth(
  req: Request & { user?: UserPayload },
  res: Response,
  next: NextFunction
) {
  // check for token
  const token = req.header("x-auth-token");
  if (!token) {
    res.status(401).send("Access denied. No token provided");
    return;
  }

  // if token, verify
  try {
    const decoded = verify(token, process.env.JWT_SECRET!);
    req.user = decoded as UserPayload;
    next();
  } catch (error) {
    res.status(400).send("Invalid token.");
  }
}

export default auth;
