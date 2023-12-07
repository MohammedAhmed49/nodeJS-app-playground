const express = require("express");
const { getAddProduct, postAddProduct } = require("../controllers/products");

const Router = express.Router();

Router.get("/add-product", getAddProduct);

Router.post("/add-product", postAddProduct);

module.exports = Router;
