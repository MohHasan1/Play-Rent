import express, { Request, Response } from "express";
import { pick } from "lodash";
import { User, validateUser } from "../models/user";
import { genSalt, hash } from "bcrypt";
import auth from "../middlewares/auth";
import { JwtPayload } from "jsonwebtoken";

const router = express.Router();

// router.get("/", auth, async (_, res) => {
//   const users = await User.find().select("-password").sort("name");
//   res.send(users);
// });

type UserPayload = {
  _id: string;
};
// we don't use /:id to prevent other user id input -> ut jwt token will hold teh id, send the jwt token we will do the rest
router.get("/me", auth, async (req: Request & { user?: UserPayload }, res) => {
  // comes from json web token
  const user = await User.findById(req.user!._id).select("-password");
  res.send(user);
});

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  // user should not be registered already:
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    res.status(400).send("User is already registered.");
    return;
  }

  // add the new user:
  user = new User(pick(req.body, ["name", "email", "password"]));

  // hash the pass with salt
  const salt = await genSalt(10);
  const hashedPass = await hash(user.password, salt);
  user.password = hashedPass;

  // save teh user in db
  try {
    await user.save();
  } catch (error) {
    const Error = error as Error; // Type assertion
    res.status(400).send(Error.message);
    return;
  }

  // create a jwt token:
  const token = user.generateAuthToken();

  res.header("x-auth-token", token).send(pick(user, ["_id", "name", "email"]));
});

export default router;
