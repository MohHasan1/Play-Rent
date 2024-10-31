import express from "express";
import { User } from "../models/user";
import { compare, genSalt, hash } from "bcrypt";
import Joi from "joi";

const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  //1.  is there any user with the given email - use 400 (bad req) - Do not provide specific details to the user
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.status(400).send("Invalid Email or Password.");
    return;
  }

  //2. validate the password
  const isValidPass = await compare(req.body.password, user.password);
  if (!isValidPass) {
    res.status(400).send("Invalid Email or Password.");
    return;
  }

  // create a json-web-token:
  const token = user.generateAuthToken();

  res.send(token);
});

export default router;

type UserType = {
  email: string;
  password: string;
};

export function validateUser(user: UserType) {
  const userSchema = Joi.object<UserType>({
    email: Joi.string().min(5).max(150).email().required(),
    password: Joi.string().min(5).max(255).required(),
  });

  return userSchema.validate(user);
}
