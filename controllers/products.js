const Product = require("../models/product");

const getAddProduct = (req, res, next) => {
    res.render("add-product", {pageTitle: "Add Product", page: "add-product"})
};

const postAddProduct = (req, res, next) => {
    const product = new Product(req.body.title);
    product.save();
    res.redirect("/");
}

const getProducts = (req, res, next) => {
    Product.fetchAllProducts((products) => {
        res.render("shop", {pageTitle: "My Shop", products: products, page: "shop"});
    });
    // res.render("shop", {pageTitle: "My Shop", products: [], page: "shop"});
}

exports.getAddProduct = getAddProduct;
exports.postAddProduct = postAddProduct;
exports.getProducts = getProducts;