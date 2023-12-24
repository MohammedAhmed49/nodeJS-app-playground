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
    res.render("shop/cart", {pageTitle: "My Cart", page: "cart"});
}

const getOrders = (req, res, next) => {
    res.render("shop/orders", {pageTitle: "My Cart", page: "cart"});
}

const getCheckout = (req, res, next) => {
    res.render("shop/checkout", {pageTitle: "My Checkout", page: "checkout"});
}


exports.getIndex = getIndex;
exports.getProducts = getProducts;
exports.getCart = getCart;
exports.getCheckout = getCheckout;
exports.getOrders = getOrders;