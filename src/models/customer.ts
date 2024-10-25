import Joi from "joi";
import { Schema, model } from "mongoose";

const customerSchema = new Schema({
  name: { type: String, minlength: 2, maxlength: 20, required: true },
  isPremium: { type: Boolean, default: false },
  phone: { type: String, minlength: 9, maxlength: 15, required: true },
});
export const Customer = model("Customer", customerSchema);

export function validateCustomer(customer: CustomerType) {
  const customerSchema = Joi.object({
    name: Joi.string().min(3).max(20).required(),
    isPremium: Joi.boolean().default(false),
    phone: Joi.string().min(9).max(15).required(),
  });

  return customerSchema.validate(customer);
}

type CustomerType = {
  name: string;
  isPremium: Boolean;
  phone: string;
};
