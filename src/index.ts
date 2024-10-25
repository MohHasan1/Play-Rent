import express from "express";
import genres from "./routes/genres";
import customers from "./routes/customers";
import dotenv from "dotenv";
import logFn from "./middlewares/logger";
import mongoose from "mongoose";

dotenv.config();
const app = express();

mongoose
  .connect("mongodb://localhost:27017/PlayRent")
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  if (process.env.NODE_ENV === "development") {
    console.log(`Server running on port: ${PORT}`);
  }
});
