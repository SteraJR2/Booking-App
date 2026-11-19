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

router.post("/login", async (req, res) => {
  const username = req.body?.username;
  const password = req.body?.password;
  try {
    if (username && password) {
      const user = await User.findOne({ username: username }).select(
        "+passwordHash",
      );
      if (!user) {
        res.status(401).json({ message: "invalid username or password." });
        return;
      }
      const isValidLogin = await bcrypt.compare(password, user.passwordHash);
      if (isValidLogin) {
        res.status(200).json({ message: "Logged in successfully." });
      } else {
        res.status(401).json({ message: "invalid username or password." });
      }
    } else {
      res.status(400).json({ message: "invalid username or password." });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong." });
    console.log(error);
  }
});
module.exports = router;
