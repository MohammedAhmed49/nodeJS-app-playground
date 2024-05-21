const express = require("express");
const {
  getLogin,
  postLogin,
  postLogout,
  getSignup,
  postSignup,
  getResetPassword,
  postResetPassword,
  getNewPassword,
  postNewPassword,
} = require("../controllers/auth");
const { check, body } = require("express-validator");
const User = require("../models/user");

const Router = express.Router();

Router.get("/login", getLogin);
Router.get("/signup", getSignup);
Router.get("/reset-password", getResetPassword);
Router.get("/reset-password/:token", getNewPassword);
Router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email!")
      .normalizeEmail(),
    body(
      "password",
      "Password should be a combination of numbers and alphabets and 5 characters minimum!"
    )
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
  ],
  postLogin
);
Router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email!")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject("E-mail already exists!");
          }
        });
      })
      .normalizeEmail(),
    body(
      "password",
      "Password should be a combination of numbers and alphabets and 5 characters minimum!"
    )
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords should match!");
      }
      return true;
    }),
  ],
  postSignup
);
Router.post("/logout", postLogout);
Router.post("/reset-password", postResetPassword);
Router.post("/new-password", postNewPassword);

module.exports = Router;
