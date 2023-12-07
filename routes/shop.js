const express = require("express");
const { getProducts } = require("../controllers/products");

const Router = express.Router();

Router.get("/", getProducts);

module.exports = Router;