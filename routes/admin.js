const express = require("express");
const {
  getAddProduct,
  postAddProduct,
  getProducts,
  getEditProduct,
  postEditProduct,
  deleteProduct,
} = require("../controllers/admin");
const isAuth = require("../middleware/isAuth");
const { body } = require("express-validator");

const Router = express.Router();

Router.get("/add-product", isAuth, getAddProduct);

Router.get("/edit-product/:productId", isAuth, getEditProduct);

Router.post(
  "/edit-product/",
  isAuth,
  [
    body("title")
      .isString()
      .isLength({ min: 3 })
      .withMessage("Title should be more than 3 characters!"),
    body("price").isNumeric(),
    body("description")
      .isString()
      .isLength({ min: 5 })
      .withMessage("Description should be more than 3 characters!"),
  ],
  postEditProduct
);

Router.post(
  "/add-product",
  isAuth,
  [
    body("title")
      .isString()
      .isLength({ min: 3 })
      .withMessage("Title should be more than 3 characters!"),
    body("price").isNumeric(),
    body("description")
      .isString()
      .isLength({ min: 5 })
      .withMessage("Description should be more than 3 characters!"),
  ],
  postAddProduct
);

Router.delete("/product/:productId", isAuth, deleteProduct);

Router.get("/products", isAuth, getProducts);

module.exports = Router;
