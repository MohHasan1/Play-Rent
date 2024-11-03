import "express-async-errors";
import express, { Express } from "express";
import error from "../middlewares/error";
import logFn from "../middlewares/logger";
import auth from "../middlewares/auth";
import customers from "../routes/customers";
import games from "../routes/games";
import genres from "../routes/genres";
import rentals from "../routes/rentals";
import users from "../routes/users";
import logger from "../utils/logger";

const routes = (app: Express) => {
  // app.get("env") === process.env.NODE_ENV
  if (process.env.NODE_ENV === "development") {
    logger.info("Logging enabled ...");
    app.use(logFn);
  }
  app.use(express.json());

  app.use("/api/genres", genres);
  app.use("/api/customers", customers);
  app.use("/api/games", games);
  app.use("/api/rentals", rentals);
  app.use("/api/users", users);
  app.use("/api/auth", auth);

  app.use(error);
};

export default routes;
