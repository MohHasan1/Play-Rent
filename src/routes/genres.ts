import express from "express";
import { Genre, validateGenre } from "../models/genre";

const router = express.Router();

router.get("/", async (_, res) => {
  const genres = await Genre.find().sort("genre");
  res.send(genres);
});

router.get("/:id", async (req, res) => {
  // Find the resource:
  const genre = await Genre.findById(req.params.id);

  if (!genre) {
    res.status(404).send("The genre with the given Id could not be found");
    return;
  }

  res.status(200).send(genre);
});

router.post("/", async (req, res) => {
  // validate the body:
  const { error } = validateGenre(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  // Add to the db:
  let newGenre = new Genre({ genre: req.body.genre });
  newGenre = await newGenre.save();

  // Send back the added genre:
  res.status(201).send(newGenre);
});

router.put("/:id", async (req, res) => {
  // validate the body:
  const { error } = validateGenre(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  // Update the doc (update directly method):
  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { genre: req.body.genre },
    { new: true }
  );

  if (!genre) {
    res.status(404).send("The genre with the given Id could not be found");
    return;
  }

  // Send the updated resource back:
  res.status(200).send(genre);
});

router.delete("/:id", async (req, res) => {
  // Delete the resource:
  const genre = await Genre.findByIdAndDelete(req.params.id);

  if (!genre) {
    res.status(404).send("The genre with the given Id could not be found");
    return;
  }
  // Send the updated resource back:
  res.status(200).send(genre);
});

export default router;
