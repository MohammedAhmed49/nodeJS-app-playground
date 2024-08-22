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
  getCheckoutSuccess,
  getInvoiceFile,
} = require("../controllers/shop");
const isAuth = require("../middleware/isAuth");

const Router = express.Router();

Router.get("/", getIndex);
Router.get("/products", getProducts);
Router.get("/products/:productId", getProduct);
Router.get("/cart", isAuth, getCart);
Router.post("/cart", isAuth, postCart);
Router.get("/checkout", getCheckout);
Router.get("/checkout/success", getCheckoutSuccess);
Router.get("/checkout/cancel", getCheckout);
Router.get("/orders", isAuth, getOrders);
Router.post("/cart-delete-item", isAuth, deleteCartItem);
Router.get("/invoices/:orderId", isAuth, getInvoiceFile);

module.exports = Router;
