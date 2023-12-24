const Product = require("../models/product");

const getIndex = (req, res, next) => {
    Product.fetchAllProducts((products) => {
        res.render("shop/index", {pageTitle: "All Products", products: products, page: "shop"})
    });
}

const getProducts = (req, res, next) => {
    Product.fetchAllProducts((products) => {
        res.render("shop/product-list", {pageTitle: "My Shop", products: products, page: "products"});
    });
}

const getCart = (req, res, next) => {
    Product.fetchAllProducts((products) => {
        res.render("shop/cart", {pageTitle: "My Cart", products: products, page: "cart"});
    });
}

const getCheckout = (req, res, next) => {
    Product.fetchAllProducts((products) => {
        res.render("shop/checkout", {pageTitle: "My Checkout", products: products, page: "checkout"});
    });
}


exports.getIndex = getIndex;
exports.getProducts = getProducts;
exports.getCart = getCart;
exports.getCheckout = getCheckout;