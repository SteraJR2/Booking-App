const bcrypt = require("bcrypt");
const express = require("express");
const User = require("./User");

const router = express.Router();

router.post("/register", async (req, res) => {
  const username = req.body?.username;
  const password = req.body?.password;
  try {
    if (username && password) {
      const passwordHash = await bcrypt.hash(password, 10);
      await User.create({
        username,
        passwordHash,
      });
      res.status(201).json({ message: "user registered." });
    } else {
      res.status(400).json({ message: "username and password required." });
    }
  } catch (error) {
    if (error.code === 11000) {
      res.status(409).json({ message: "Username taken." });
    } else {
      res.status(500).json({ message: "Something went wrong." });
    }
    console.log(error);
  }
});

module.exports = router;
