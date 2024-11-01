import express from "express";
import { Rental, validateRental } from "../models/rental";
import { Customer } from "../models/customer";
import { Game } from "../models/game";
import auth from "../middlewares/auth";

const router = express.Router();

router.get("/", async (_, res) => {
  // throw new Error("rent not working")

  const rentals = await Rental.find().sort("-rentalDate");
  res.send(rentals);
});

router.post("/",auth, async (req, res) => {
  const { error } = validateRental(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) {
    res.status(400).send("Invalid customer.");
    return;
  }

  const game = await Game.findById(req.body.gameId);
  if (!game) {
    res.status(400).send("Invalid game.");
    return;
  }

  if (game.numberInStock === 0) {
    res.status(400).send("Movie not in stock.");
    return;
  }

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      isPremium: customer.isPremium,
      phone: customer.phone,
    },
    game: {
      _id: game._id,
      title: game.title,
      dailyRentalRate: game.dailyRentalRate,
    },
  });

  // no transactions
  rental = await rental.save();

  game.numberInStock--;
  game.save();

  res.send(rental);

  // Start the session for the transaction
  //   const session = await startSession();
  //   session.startTransaction();

  //   try {
  //     // Create the rental document
  //     const rental = new Rental({
  //       customer: {
  //         _id: customer._id,
  //         name: customer.name,
  //         isPremium: customer.isPremium,
  //         phone: customer.phone,
  //       },
  //       game: {
  //         _id: game._id,
  //         title: game.title,
  //         dailyRentalRate: game.dailyRentalRate,
  //       },
  //     });

  //     // Save the rental document
  //     await rental.save({ session })

  //     // Decrease the stock count of the game
  //     game.numberInStock--;
  //     await game.save({ session });

  //     // Commit the transaction
  //     await session.commitTransaction();
  //     session.endSession();

  //     // Send the rental as the response after the transaction is complete
  //     res.send(rental);
  //   } catch (error) {
  //     // Abort the transaction if there's an error
  //     await session.abortTransaction();
  //     session.endSession();

  //     console.error("Transaction error:", error);
  //     res.status(500).send("Something went wrong");
  //   }
});

router.get("/:id", async (req, res) => {
  const rental = await Rental.findById(req.params.id);

  if (!rental) {
    res.status(404).send("The rental with the given ID was not found.");
    return;
  }

  res.send(rental);
});

export default router;
