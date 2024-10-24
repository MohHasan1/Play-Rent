import express from "express";
import genres from "./routes/genres";
import dotenv from "dotenv";
import logFn from "./logger";

dotenv.config();
const app = express();

// app.get("env") === process.env.NODE_ENV
if (process.env.NODE_ENV === "development") {
  console.log("Logging enabled ...");
  app.use(logFn);
}
app.use(express.json());
app.use('/api/genres', genres)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  if (process.env.NODE_ENV === "development") {
    console.log(`Server running on port: ${PORT}`);
  }
});
