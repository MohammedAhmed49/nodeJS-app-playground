const Product = require("../models/product");

const getAddProduct = (req, res, next) => {
    res.render("admin/edit-product", {pageTitle: "Add Product", page: "add-product", editing: false})
};

const getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if(!editMode) {
        return res.redirect("/");
    }
    const productId = req.params.productId;
    Product.getProductById(productId, (product) => {
        if(!product) {
            res.redirect("/");
        }
        res.render("admin/edit-product", {pageTitle: "Edit Product", page: "edit-product", editing: editMode, product: product})
    }) 
};

const postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const price = req.body.price;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const product = new Product(title, imageUrl, price, description);
    product.save();
    res.redirect("/");
}

const getProducts = (req, res, next) => {
    Product.fetchAllProducts(products => {
        res.render("admin/products", {pageTitle: "Admin Products", prods: products, page: "admin-products"})
    })
}

exports.getAddProduct = getAddProduct;
exports.getEditProduct = getEditProduct;
exports.postAddProduct = postAddProduct;
exports.getProducts = getProducts;