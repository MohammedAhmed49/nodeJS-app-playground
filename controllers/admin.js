const Product = require("../models/product");

const getAddProduct = (req, res, next) => {
    res.render("admin/add-product", {pageTitle: "Add Product", page: "add-product"})
};

const postAddProduct = (req, res, next) => {
    const product = new Product(req.body.title);
    product.save();
    res.redirect("/");
}

const getProducts = (req, res, next) => {
    Product.fetchAllProducts(products => {
        res.render("admin/products", {pageTitle: "Admin Products", products: products, page: "admin-products"})
    })
}

exports.getAddProduct = getAddProduct;
exports.postAddProduct = postAddProduct;
exports.getProducts = getProducts;