import { Document, model, type ObjectId, Schema, Types } from "mongoose";
import { genreSchema } from "./genre";
import Joi from "joi";

// custom customer that will be embedded in the Rental doc ()
type CustomerType = {
  name: string;
  isPremium: boolean;
  phone: number;
};

type GameType = {
  title: string;
  genre: typeof genreSchema;
  dailyRentalRate: number;
};

interface IRental extends Document {
  customer: CustomerType;
  game: GameType;
  rentalDate: Date;
  returnedDate: Date;
  rentalFee: number;
}

export const Rental = model<IRental>(
  "Rental",
  new Schema({
    customer: {
      type: new Schema({
        name: { type: String, minlength: 2, maxlength: 20, required: true },
        isPremium: { type: Boolean },
        phone: { type: String, minlength: 9, maxlength: 15, required: true },
      }),
      required: true,
    },
    game: {
      type: new Schema({
        title: {
          type: String,
          required: true,
          trim: true,
          minlength: 1,
          maxlength: 40,
        },
        genre: {
          type: genreSchema,
          require: true,
        },
        dailyRentalRate: {
          type: Number,
          required: true,
          min: 0,
          max: 255,
        },
      }),
      required: true,
    },
    rentalDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    returnedDate: {
      type: Date,
    },
    rentalFee: {
      type: Number,
    },
  })
);

// Custom Joi ObjectId validation
const objectId = () =>
  Joi.string().custom((value, helpers) => {
    if (!Types.ObjectId.isValid(value)) {
      return helpers.error("any.invalid");
    }
    return value; // Return the validated value
  });

// RentalType with ObjectId validation
type RentalType = {
  customerId: ObjectId;
  gameId: ObjectId;
};

export function validateRental(rental: RentalType) {
  const rentalSchema = Joi.object<RentalType>({
    customerId: objectId().required(),
    gameId: objectId().required(),
  });

  return rentalSchema.validate(rental);
}
