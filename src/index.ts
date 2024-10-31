import express from "express";
import genres from "./routes/genres";
import customers from "./routes/customers";
import movies from "./routes/games";
import users from "./routes/users";
import rentals from "./routes/rentals";
import auth from "./routes/auth";
import dotenv from "dotenv";
import logFn from "./middlewares/logger";
import mongoose from "mongoose";

dotenv.config();
const app = express();

// if JWT_SECRET is not set
if (!process.env.JWT_SECRET) {
  if (process.env.NODE_ENV === "development") {
    console.log("FATAL ERROR: No JWT_SECRET Key");
    process.exit(1);
  }
}

mongoose
  .connect(process.env.MONGO_DB_URL!)
  .then(() => console.log("Connected to MongoDB - PlayRent..."))
  .catch(() => console.log("Failed to connect..."));

// app.get("env") === process.env.NODE_ENV
if (process.env.NODE_ENV === "development") {
  console.log("Logging enabled ...");
  app.use(logFn);
}
app.use(express.json());

app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use("/api/auth", auth);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  if (process.env.NODE_ENV === "development") {
    console.log(`Server running on port: ${PORT}`);
  }
});
