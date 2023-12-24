const express = require("express");
const { getAddProduct, postAddProduct, getProducts } = require("../controllers/admin");

const Router = express.Router();

Router.get("/add-product", getAddProduct);

Router.post("/add-product", postAddProduct);

Router.get("/products", getProducts);

module.exports = Router;
