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
const isAuth = require("../middleware/isAuth");

const Router = express.Router();

Router.get("/", getIndex);
Router.get("/products", getProducts);
Router.get("/products/:productId", getProduct);
Router.get("/cart", isAuth, getCart);
Router.post("/cart", isAuth, postCart);
// Router.get("/checkout", getCheckout);
Router.get("/orders", isAuth, getOrders);
Router.post("/cart-delete-item", isAuth, deleteCartItem);
Router.post("/create-order", isAuth, postCreateOrder);

module.exports = Router;
