import { Schema, Document, model } from "mongoose";
import { genreSchema } from "./genre";
import Joi from "joi";

const gameSchema = new Schema<IGame>({
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
  numberInStock: {
    type: Number,
    required: true,
    min: 0,
  },
  inStock: {
    type: Boolean,
    default: function () {
      return this.numberInStock > 0;
    },
  },
  dailyRentalRate: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
  },
});

// Hook to update `inStock` based on `numberInStock` before each save
gameSchema.pre<IGame>("save", function (next) {
  this.inStock = this.numberInStock > 0;
  next();
});

export const Game = model<IGame>("Game", gameSchema);

export function validateGame(game: IGame) {
  const gameSchema = Joi.object({
    title: Joi.string().min(1).max(40).required(),
    genre: Joi.string().required(),
    numberInStock: Joi.number().min(0).required(),
    inStock: Joi.boolean().default(true),
    dailyRentalRate: Joi.number().min(0).max(255).required(),
  });

  return gameSchema.validate(game);
}

interface IGame extends Document {
  title: string;
  genre: typeof genreSchema;
  numberInStock: number;
  inStock: boolean;
  dailyRentalRate: number;
}
