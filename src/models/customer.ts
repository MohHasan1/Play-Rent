import Joi from "joi";
import { Document, Schema, model } from "mongoose";

const customerSchema = new Schema<ICustomer>({
  name: { type: String, minlength: 2, maxlength: 20, required: true },
  isPremium: { type: Boolean, default: false },
  phone: { type: String, minlength: 9, maxlength: 15, required: true },
});
export const Customer = model<ICustomer>("Customer", customerSchema);

export function validateCustomer(customer: ICustomer) {
  const customerSchema = Joi.object({
    name: Joi.string().min(3).max(20).required(),
    isPremium: Joi.boolean().default(false),
    phone: Joi.string().min(9).max(15).required(),
  });

  return customerSchema.validate(customer);
}

interface ICustomer extends Document {
  name: string;
  isPremium: Boolean;
  phone: string;
};
