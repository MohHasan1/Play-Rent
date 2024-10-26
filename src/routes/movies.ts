import express from "express";
import { Movie, validateMovie } from "../models/movie";
import { Genre } from "../models/genre";

const router = express.Router();

router.get("/", async (_, res) => {
  const movies = await Movie.find().sort("name");
  res.send(movies);
});

router.get("/:id", async (req, res) => {
  const movie = await Movie.findById(req.params.id);

  if (!movie) {
    res.status(404).send("The movie with the given ID was not found.");
    return;
  }

  res.send(movie);
});

router.post("/", async (req, res) => {
  const { error } = validateMovie(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  // get the genre to embed
  const genre = await Genre.findById(req.body.genre);
  if (!genre) {
    res.status(400).send("Invalid genre.");
    return;
  }

  // hybrid - embedding and ref
  let movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      genre: genre.genre,
    },
    numberInStock: req.body.numberInStock,
    inStock: req.body?.inStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });
  movie = await movie.save();

  res.send(movie);
});

router.put("/:id", async (req, res) => {
  const { error } = validateMovie(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  const genre = await Genre.findById(req.body.genre);
  if (!genre) {
    res.status(400).send("Invalid genre.");
    return;
  }

  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      genre: {
        _id: genre._id,
        genre: genre.genre,
      },
      numberInStock: req.body.numberInStock,
      inStock: req.body.inStock,
      dailyRentalRate: req.body.dailyRentalRate,
    },
    { new: true }
  );

  if (!movie) {
    res.status(404).send("The movie with the given ID was not found.");
    return;
  }

  res.send(movie);
});

router.delete("/:id", async (req, res) => {
  const movie = await Movie.findByIdAndDelete(req.params.id);

  if (!movie) {
    res.status(404).send("The movie with the given ID was not found.");
    return;
  }

  res.send(movie);
});

export default router;
