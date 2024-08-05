const { validationResult } = require("express-validator");
const Product = require("../models/product");
const { deleteFile } = require("../utils/file");

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
  const image = req.file;
  const description = req.body.description;
  const user = req.user;

  if (!image) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      page: "add-product",
      editing: false,
      errorMessage: "File uploaded is not a valid image",
    });
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      page: "add-product",
      editing: false,
      errorMessage: errors.array()[0].msg,
    });
  }
  const imageUrl = image.path;
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
  const image = req.file;
  const description = req.body.description;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "edit Product",
      page: "edit-product",
      editing: true,
      product: {
        _id: id,
        title,
        price,
        description,
      },
      errorMessage: errors.array()[0].msg,
    });
  }

  Product.findById(id)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }
      if (image) {
        deleteFile(product.imageUrl);
        product.imageUrl = image.path;
      }
      product.title = title;
      product.price = price;
      product.description = description;
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

const deleteProduct = (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .then((product) => {
      if (!product) {
        return next(new Error("No product was found"));
      }
      deleteFile(product.imageUrl);
      return Product.deleteOne({ _id: id, userId: req.user.id });
    })
    .then((response) => {
      res.status(200).json({ message: "Success!" });
    })
    .catch((err) => {
      res.status(500).json({ message: "Deleting product failed." });
    });
};

exports.getAddProduct = getAddProduct;
exports.postAddProduct = postAddProduct;
exports.getEditProduct = getEditProduct;
exports.postEditProduct = postEditProduct;
exports.getProducts = getProducts;
exports.deleteProduct = deleteProduct;
