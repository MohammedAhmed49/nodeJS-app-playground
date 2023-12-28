const Cart = require("../models/cart");
const Product = require("../models/product");

const getIndex = (req, res, next) => {
    Product.fetchAllProducts((products) => {
        res.render("shop/index", {pageTitle: "All Products", prods: products, page: "shop"})
    });
}

const getProducts = (req, res, next) => {
    Product.fetchAllProducts((products) => {
        res.render("shop/product-list", {pageTitle: "My Shop", prods: products, page: "products"});
    });
}

const getProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.getProductById(productId, (product) => {
        res.render("shop/product-detail", {pageTitle: product.title, page: "products", product: product})
    })
}

const getCart = (req, res, next) => {
    res.render("shop/cart", {pageTitle: "My Cart", page: "cart"});
}

const postCart = (req, res, next) => {
    const productId = req.body.productId;
    Product.getProductById(productId, (product) => {
        Cart.addProductToCart(productId, product.price);
    })
    res.redirect("/cart");
}

const getOrders = (req, res, next) => {
    res.render("shop/orders", {pageTitle: "My Cart", page: "cart"});
}

const getCheckout = (req, res, next) => {
    res.render("shop/checkout", {pageTitle: "My Checkout", page: "checkout"});
}


exports.getIndex = getIndex;
exports.getProducts = getProducts;
exports.getProduct = getProduct;
exports.getCart = getCart;
exports.postCart = postCart;
exports.getCheckout = getCheckout;
exports.getOrders = getOrders;