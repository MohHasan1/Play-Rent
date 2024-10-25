import express from "express";
import { Customer, validateCustomer } from "../models/customer";

const router = express.Router();

router.get("/", async (_, res) => {
  res.send(await Customer.find().sort("name"));
});

router.get("/:id", async (req, res) => {
  // Find the resource:
  const customer = await Customer.findById(req.params.id);

  if (!customer) {
    res.status(404).send("Customer with the given Id could not be found");
    return;
  }

  res.status(200).send(customer);
});

router.post("/", async (req, res) => {
  // validate the body:
  const { error } = validateCustomer(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  // Add to the db:
  let customer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    isPremium: req.body.isPremium,
  });
  customer = await customer.save();

  // Send back the added genre:
  res.status(201).send(customer);
});

router.put("/:id", async (req, res) => {
  // validate the body:
  const { error } = validateCustomer(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  // Update the doc (update directly method):
  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      phone: req.body.phone,
      isPremium: req.body.isPremium,
    },
    { new: true }
  );

  if (!customer) {
    res.status(404).send("Customer with the given Id could not be found");
    return;
  }

  // Send the updated resource back:
  res.status(200).send(customer);
});

router.delete("/:id", async (req, res) => {
  // Delete the resource:
  const customer = await Customer.findByIdAndDelete(req.params.id);

  if (!customer) {
    res.status(404).send("Customer with the given Id could not be found");
    return;
  }
  // Send the updated resource back:
  res.status(200).send(customer);
});

export default router;
