const express = require("express");
const { getProducts, getIndex, getCart, getCheckout } = require("../controllers/shop");

const Router = express.Router();

Router.get("/", getIndex);
Router.get("/products", getProducts);
Router.get("/cart", getCart);
Router.get("/checkout", getCheckout);

module.exports = Router;