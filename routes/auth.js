const express = require("express");
const {
  getLogin,
  postLogin,
  postLogout,
  getSignup,
  postSignup,
  getResetPassword,
} = require("../controllers/auth");

const Router = express.Router();

Router.get("/login", getLogin);
Router.get("/signup", getSignup);
Router.get("/reset-password", getResetPassword);
Router.post("/login", postLogin);
Router.post("/signup", postSignup);
Router.post("/logout", postLogout);

module.exports = Router;
