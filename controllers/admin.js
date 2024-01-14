const Product = require("../models/product");

const getAddProduct = (req, res, next) => {
    res.render("admin/edit-product", {pageTitle: "Add Product", page: "add-product", editing: false})
};

const postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const price = req.body.price;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const product = new Product(null, title, imageUrl, price, description);
    product.save().then().catch(err => console.log(err));
    res.redirect("/");
}

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

const postEditProduct = (req, res, next) => {
    const id = req.body.productId;
    const title = req.body.title;
    const price = req.body.price;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const product = new Product(id, title, imageUrl, price, description);
    product.save();
    res.redirect("/admin/products");
}

const getProducts = (req, res, next) => {
    Product.fetchAllProducts(products => {
        res.render("admin/products", {pageTitle: "Admin Products", prods: products, page: "admin-products"})
    })
}

const postDeleteProduct = (req, res, next) => {
    const id = req.body.productId;
    Product.deleteProduct(id);
    res.redirect("/admin/products");
}

exports.getAddProduct = getAddProduct;
exports.postAddProduct = postAddProduct;
exports.getEditProduct = getEditProduct;
exports.postEditProduct = postEditProduct;
exports.getProducts = getProducts;
exports.postDeleteProduct = postDeleteProduct;