const express = require("express");
const { getLogin, postLogin } = require("../controllers/auth");

const Router = express.Router();

Router.get("/login", getLogin);
Router.post("/login", postLogin);

module.exports = Router;
