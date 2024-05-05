const Product = require("../models/product");

const getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    page: "add-product",
    editing: false,
  });
};

const postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const price = req.body.price;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  const user = req.user;
  const product = new Product({ title, price, imageUrl, description, userId: user });
  product
    .save()
    .then((response) => {
      console.log("Created product");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

const getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const productId = req.params.productId;
  Product.findById(productId).then((product) => {
    if (!product) {
      res.redirect("/");
    }
    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      page: "edit-product",
      editing: editMode,
      product: product,
    });
  });
};

const postEditProduct = (req, res, next) => {
  const id = req.body.productId;
  const title = req.body.title;
  const price = req.body.price;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  const userId = req.body.userId;

  Product.findById(id)
    .then((product) => {
      product.title = title;
      product.price = price;
      product.description = description;
      product.imageUrl = imageUrl;
      return product.save();
    })
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

const getProducts = (req, res, next) => {
  Product.find().then((products) => {
    res.render("admin/products", {
      pageTitle: "Admin Products",
      prods: products,
      page: "admin-products",
    });
  });
};

const postDeleteProduct = (req, res, next) => {
  const id = req.body.productId;
  Product.findByIdAndDelete(id)
    .then((response) => {
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

exports.getAddProduct = getAddProduct;
exports.postAddProduct = postAddProduct;
exports.getEditProduct = getEditProduct;
exports.postEditProduct = postEditProduct;
exports.getProducts = getProducts;
exports.postDeleteProduct = postDeleteProduct;
