import Joi from "joi";
import { sign } from "jsonwebtoken";
import { type Document, model, Schema } from "mongoose";

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  generateAuthToken: () => string;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 150,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  isAdmin: Boolean,
});

// token gen
userSchema.methods.generateAuthToken = function () {
  const token = sign(
    { _id: this._id, isAdmin: this.isAdmin },
    process.env.JWT_SECRET!
  );
  return token;
};

export const User = model<IUser>("User", userSchema);

type UserType = {
  name: string;
  email: string;
  password: string;
};

export function validateUser(user: UserType) {
  const userSchema = Joi.object<UserType>({
    name: Joi.string().min(1).max(30).required(),
    email: Joi.string().min(5).max(150).email().required(),
    password: Joi.string().min(5).max(255).required(),
  });

  return userSchema.validate(user);
}
