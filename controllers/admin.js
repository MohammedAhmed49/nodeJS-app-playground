const { validationResult } = require("express-validator");
const Product = require("../models/product");

const getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    page: "add-product",
    errorMessage: "",
    editing: false,
  });
};

const postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const price = req.body.price;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  const user = req.user;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      page: "add-product",
      editing: false,
      errorMessage: errors.array()[0].msg,
    });
  }
  const product = new Product({
    title,
    price,
    imageUrl,
    description,
    userId: user,
  });
  product
    .save()
    .then((response) => {
      console.log("Created product");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

const getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const productId = req.params.productId;
  Product.findById(productId)
    .then((product) => {
      if (!product) {
        res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        page: "edit-product",
        editing: editMode,
        product: product,
        errorMessage: "",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

const postEditProduct = (req, res, next) => {
  const id = req.body.productId;
  const title = req.body.title;
  const price = req.body.price;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const editMode = req.query.edit;
    Product.findById(id)
      .then((product) => {
        console.log(product);
        if (!product) {
          res.redirect("/");
        }
        return res.status(422).render("admin/edit-product", {
          pageTitle: "edit Product",
          page: "edit-product",
          editing: true,
          product: product,
          errorMessage: errors.array()[0].msg,
        });
      })
      .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  }

  Product.findById(id)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }
      product.title = title;
      product.price = price;
      product.description = description;
      product.imageUrl = imageUrl;
      return product.save().then(() => {
        res.redirect("/admin/products");
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

const getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id }).then((products) => {
    res.render("admin/products", {
      pageTitle: "Admin Products",
      prods: products,
      page: "admin-products",
      isAuthenticated: req.session.isLoggedIn,
    });
  });
};

const postDeleteProduct = (req, res, next) => {
  const id = req.body.productId;
  Product.deleteOne({ id: id, userId: req.user.id })
    .then((response) => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getAddProduct = getAddProduct;
exports.postAddProduct = postAddProduct;
exports.getEditProduct = getEditProduct;
exports.postEditProduct = postEditProduct;
exports.getProducts = getProducts;
exports.postDeleteProduct = postDeleteProduct;
