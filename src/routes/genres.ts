import express from "express";
import Joi from "joi";

const router = express.Router();

const genres = [
  { id: 1, genre: "Action" },
  { id: 2, genre: "Adventure" },
  { id: 3, genre: "Role-Playing" },
  { id: 4, genre: "Simulation" },
  { id: 5, genre: "Strategy" },
  { id: 6, genre: "Sports" },
  { id: 7, genre: "Puzzle" },
  { id: 8, genre: "Horror" },
];

router.get("/", (_, res) => {
  res.send(genres);
});

router.get("/:id", (req, res) => {
  // Find the resource:
  const genre = genres.find((genre) => genre.id === parseInt(req.params.id));
  if (!genre) {
    res.status(404).send("The genre with the given Id could not be found");
    return;
  }

  res.status(200).send(genre);
});

router.post("/", (req, res) => {
  // validate the body:
  const { error } = validateGenre(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  // Add to the db:
  const newGenre = { id: genres.length + 1, genre: req.body.genre };
  genres.push(newGenre);

  // Send back the added genre:
  res.status(201).send(newGenre);
});

router.put("/:id", (req, res) => {
  // Find the resource:
  const genre = genres.find((genre) => genre.id === parseInt(req.params.id));
  if (!genre) {
    res.status(404).send("The genre withe the given Id could not be found.");
    return;
  }
  // Update the resource:
  genre.genre = req.body.genre;

  // Send the updated resource back:
  res.status(200).send(genre);
});

router.delete("/:id", (req, res) => {
  // Find the resource:
  const genre = genres.find((genre) => genre.id === parseInt(req.params.id));
  if (!genre) {
    res.status(404).send("The genre withe the given Id could not be found.");
    return;
  }

  // Delete the resource:
  const index = genres.indexOf(genre);
  genres.splice(index, 1);

  // Send the updated resource back:
  res.status(200).send(genre);
});

function validateGenre(genre: Genre) {
  const GenreSchema = Joi.object({
    genre: Joi.string().min(2).required(),
  });

  return GenreSchema.validate(genre);
}

type Genre = {
  genre: string;
};

export default router;