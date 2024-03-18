const express = require("express");
const {
  getProducts,
  getIndex,
  getCart,
  getCheckout,
  getOrders,
  getProduct,
  postCart,
  deleteCartItem,
  postCreateOrder,
} = require("../controllers/shop");

const Router = express.Router();

Router.get("/", getIndex);
Router.get("/products", getProducts);
Router.get("/products/:productId", getProduct);
Router.get("/cart", getCart);
Router.post("/cart", postCart);
Router.get("/checkout", getCheckout);
Router.get("/orders", getOrders);
Router.post("/cart-delete-item", deleteCartItem);
Router.post("/create-order", postCreateOrder);

module.exports = Router;
