import Joi from "joi";
import { Schema, model } from "mongoose";

const genreSchema = new Schema({
  genre: { type: String, required: true, minlength: 2, maxlength: 20 },
});

export const Genre = model("Genre", genreSchema);

export function validateGenre(genre: Genre) {
  const GenreSchema = Joi.object({
    genre: Joi.string().min(3).max(20).required(),
  });

  return GenreSchema.validate(genre);
}

type Genre = {
  genre: string;
};
