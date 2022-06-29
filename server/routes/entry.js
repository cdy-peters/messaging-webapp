const express = require("express");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/User");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  const email_existence = (await User.findOne({ email })) ? true : false;
  const username_existence = (await User.findOne({ username })) ? true : false;

  if (email_existence || username_existence) {
    res.json({
      email_existence: email_existence,
      username_existence: username_existence,
    });
  } else {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username: username,
      email: email,
      password: hash,
    });

    newUser
      .save()
      .then((user) => {
        res.json({
          email_existence: false,
          username_existence: false,
        });
      })
      .catch((err) => {
        res.send(err);
      });
  }
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  User.findOne({ username }, (err, user) => {
    if (err) throw err;

    if (!user) {
      res.json({ msg: "User does not exist" });
    } else if (!bcrypt.compareSync(password, user.password)) {
      res.json({ msg: "Password is incorrect" });
    } else {
      res.json({ msg: "User logged in" });
    }
  });
});

module.exports = router;
