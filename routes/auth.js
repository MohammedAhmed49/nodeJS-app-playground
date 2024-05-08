const express = require("express");
const { getLogin, postLogin, postLogout } = require("../controllers/auth");

const Router = express.Router();

Router.get("/login", getLogin);
Router.post("/login", postLogin);
Router.post("/logout", postLogout);

module.exports = Router;
