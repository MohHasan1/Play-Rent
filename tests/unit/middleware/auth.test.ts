import { User } from "../../../src/models/user";
import auth from "../../../src/middlewares/auth";
import { NextFunction, Response, Request } from "express";
import { Types } from "mongoose";

require("dotenv").config();

describe("auth middleware", () => {
  
  it("should populate the req.user with the payload of valid JWT", () => {
    const user = { _id: new Types.ObjectId().toHexString(), isAdmin: true };
    const token = new User(user).generateAuthToken();

    const req = {
      header: jest.fn().mockReturnValue(token),
      user: null,
    } as Partial<Request> & { user: any };
    const res = {} as Response;
    const next = jest.fn() as NextFunction;

    auth(req as Request, res, next);

    expect(req.user).toBeDefined();
    expect(req.user).toMatchObject(user)
  });
});
