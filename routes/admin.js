const express = require("express");
const { getAddProduct, postAddProduct, getProducts, getEditProduct, postEditProduct } = require("../controllers/admin");

const Router = express.Router();

Router.get("/add-product", getAddProduct);

Router.get("/edit-product/:productId", getEditProduct);

Router.post("/edit-product/", postEditProduct);

Router.post("/add-product", postAddProduct);

Router.get("/products", getProducts);

module.exports = Router;
