const Cart = require("../models/cart");
const Product = require("../models/product");

const getIndex = (req, res, next) => {
    Product.findAll().then(products => {
        res.render("shop/index", {pageTitle: "My Shop", prods: products, page: "shop"})
    }).catch(err => {
        console.log(err);
    });
}

const getProducts = (req, res, next) => {
    Product.findAll().then(products => {
        res.render("shop/product-list", {pageTitle: "All Products", prods: products, page: "products"})
    }).catch(err => {
        console.log(err);
    });
}

const getProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.findByPk(productId).then((product) => {
        res.render("shop/product-detail", {pageTitle: product.title, page: "products", product: product})
    }).catch(err => err);
}

const getCart = (req, res, next) => {
    Cart.getCart((cart) => {
        Product.fetchAllProducts((products) => {
            const cartProducts = [];
            products.forEach(product => {
                const existingProductInCart = cart.products.find(item => item.id === product.id);
                if(existingProductInCart) {
                    cartProducts.push({productData: product, qty: existingProductInCart.qty});
                }
            });
            res.render("shop/cart", {pageTitle: "My Cart", products: cartProducts,page: "cart"});
        })
    });
    
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

const deleteCartItem = (req, res, next) => {
    Product.getProductById(req.body.productId, (product) => {
        Cart.deleteProduct(product.id, product.price);
        res.redirect("/cart");
    });
}


exports.getIndex = getIndex;
exports.getProducts = getProducts;
exports.getProduct = getProduct;
exports.getCart = getCart;
exports.postCart = postCart;
exports.getCheckout = getCheckout;
exports.getOrders = getOrders;
exports.deleteCartItem = deleteCartItem;