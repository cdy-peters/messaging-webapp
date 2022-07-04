const express = require("express");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/UserModel");

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
          token: user._id.toString(),
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

    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          res.json({
            token: user._id.toString(),
          });
        } else {
          res.json({
            error: "invalid_password",
          });
        }
      });
    } else {
      res.json({
        error: "invalid_user",
      });
    }
  });
});

module.exports = router;
