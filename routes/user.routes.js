const express = require("express");
const bcrypt = require("bcrypt");
const userRouter = express.Router();
const { UserModel } = require("../models/user.model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

userRouter.post("/register", async (req, res) => {
  const { name, email, gender, age, city, is_married, password } = req.body;
  try {
    bcrypt.hash(password, 5, async (err, hash) => {
      if (err) {
        res.status(400).json({ error: err.message });
      } else {
        const user = new UserModel({
          name,
          email,
          gender,
          age,
          city,
          is_married,
          password: hash,
        });
        await user.save();
        res
          .status(200)
          .json({ msg: "User has been registered", user: req.body });
      }
    });
  } catch (error) {
    res.status(400).json({ error: err.message });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          let token = jwt.sign(
            { userID: user._id, user: user.name },
            process.env.secret
          );
          res.status(200).json({ msg: "logged In", token });
        } else {
          res.status(200).json({ error: "wrong credentials" });
        }
      });
    } else {
      res.status(200).json({ error: "user does not exist" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

userRouter.get("/logout", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  try {
    blacklist.push(token);
    res.status(200).json({ msg: "User has been logged out" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = {
  userRouter,
};
