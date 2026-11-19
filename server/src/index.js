require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./auth");

const app = express();
app.use(express.json());

app.use("/api/auth", authRouter);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected.");
    app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Connection failed: ", err.message);
    process.exit(1);
  });
