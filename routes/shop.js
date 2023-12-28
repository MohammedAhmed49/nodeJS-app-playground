const express = require("express");
const { getProducts, getIndex, getCart, getCheckout, getOrders, getProduct, postCart } = require("../controllers/shop");

const Router = express.Router();

Router.get("/", getIndex);
Router.get("/products", getProducts);
Router.get("/products/:productId", getProduct);
Router.get("/cart", getCart);
Router.post("/cart", postCart);
Router.get("/checkout", getCheckout);
Router.get("/orders", getOrders);

module.exports = Router;