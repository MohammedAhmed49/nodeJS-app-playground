const express = require("express");
const { getProducts, getIndex, getCart, getCheckout, getOrders } = require("../controllers/shop");

const Router = express.Router();

Router.get("/", getIndex);
Router.get("/products", getProducts);
Router.get("/cart", getCart);
Router.get("/checkout", getCheckout);
Router.get("/orders", getOrders);

module.exports = Router;