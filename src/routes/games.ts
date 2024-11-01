import express from "express";
import { Game, validateGame } from "../models/game";
import { Genre } from "../models/genre";
import auth from "../middlewares/auth";

const router = express.Router();

router.get("/", async (_, res) => {
  // throw new Error("ggg not working")

  const games = await Game.find().sort("name");
  res.send(games);
});

router.get("/:id", async (req, res) => {
  const games = await Game.findById(req.params.id);

  if (!games) {
    res.status(404).send("The games with the given ID was not found.");
    return;
  }

  res.send(games);
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
  let game = new Game({
    title: req.body.title,
    genre: {
      _id: genre._id,
      genre: genre.genre,
    },
    numberInStock: req.body.numberInStock,
    inStock: req.body?.inStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });
  game = await game.save();

  res.send(game);
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

  const games = await Game.findByIdAndUpdate(
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

  if (!games) {
    res.status(404).send("The movie with the given ID was not found.");
    return;
  }

  res.send(games);
});

router.delete("/:id", auth, async (req, res) => {
  const games = await Game.findByIdAndDelete(req.params.id);

  if (!games) {
    res.status(404).send("The game with the given ID was not found.");
    return;
  }

  res.send(games);
});

export default router;
