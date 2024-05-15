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

const Router = express.Router();

Router.get("/login", getLogin);
Router.get("/signup", getSignup);
Router.get("/reset-password", getResetPassword);
Router.get("/reset-password/:token", getNewPassword);
Router.post("/login", postLogin);
Router.post("/signup", postSignup);
Router.post("/logout", postLogout);
Router.post("/reset-password", postResetPassword);
Router.post("/new-password", postNewPassword);

module.exports = Router;
