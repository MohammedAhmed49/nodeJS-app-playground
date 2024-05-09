const express = require("express");
const {
  getAddProduct,
  postAddProduct,
  getProducts,
  getEditProduct,
  postEditProduct,
  postDeleteProduct,
} = require("../controllers/admin");
const isAuth = require("../middleware/isAuth");

const Router = express.Router();

Router.get("/add-product", isAuth, getAddProduct);

Router.get("/edit-product/:productId", isAuth, getEditProduct);

Router.post("/edit-product/", isAuth, postEditProduct);

Router.post("/add-product", isAuth, postAddProduct);

Router.post("/delete-product", isAuth, postDeleteProduct);

Router.get("/products", isAuth, getProducts);

module.exports = Router;
