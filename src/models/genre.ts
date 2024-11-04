import Joi from "joi";
import { Document, Schema, model } from "mongoose";

export const genreSchema = new Schema<IGenre>({
  genre: { type: String, required: true, minlength: 3, maxlength: 20 },
});

export const Genre = model("Genre", genreSchema);

export function validateGenre(genre: IGenre) {
  const GenreSchema = Joi.object({
    genre: Joi.string().min(3).max(20).required(),
  });

  return GenreSchema.validate(genre);
}

export interface IGenre extends Document {
  genre: string;
}
