import { Types } from "mongoose";
import { User } from "../../../src/models/user";
import jwt from "jsonwebtoken";

require("dotenv").config();

describe("user.generateAuthToken", () => {
  it("should return a valid JWT", () => {
    const payload = { _id: new Types.ObjectId().toHexString(), isAdmin: true };
    const user = new User(payload);
    const token = user.generateAuthToken();

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    expect(decoded).toMatchObject(payload);
  });
});
