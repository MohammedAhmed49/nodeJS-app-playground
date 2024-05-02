const express = require("express");
const { getLogin } = require("../controllers/auth");

const Router = express.Router();

Router.get("/login", getLogin);

module.exports = Router;
