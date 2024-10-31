import express from "express";
import { Game, validateGame } from "../models/game";
import { Genre } from "../models/genre";
import auth from "../middlewares/auth";

const router = express.Router();

router.get("/", async (_, res) => {
  const movies = await Game.find().sort("name");
  res.send(movies);
});

router.get("/:id", async (req, res) => {
  const movie = await Game.findById(req.params.id);

  if (!movie) {
    res.status(404).send("The movie with the given ID was not found.");
    return;
  }

  res.send(movie);
});

router.post("/", auth, async (req, res) => {
  const { error } = validateGame(req.body);
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
  let movie = new Game({
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

router.put("/:id", auth, async (req, res) => {
  const { error } = validateGame(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  const genre = await Genre.findById(req.body.genre);
  if (!genre) {
    res.status(400).send("Invalid genre.");
    return;
  }

  const movie = await Game.findByIdAndUpdate(
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

router.delete("/:id", auth, async (req, res) => {
  const movie = await Game.findByIdAndDelete(req.params.id);

  if (!movie) {
    res.status(404).send("The movie with the given ID was not found.");
    return;
  }

  res.send(movie);
});

export default router;
