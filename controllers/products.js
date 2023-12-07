const products = [];

const getAddProduct = (req, res, next) => {
    res.render("add-product", {pageTitle: "Add Product", page: "add-product"})
};

const postAddProduct = (req, res, next) => {
    products.push({title: req.body.title});
    res.redirect("/");
}

const getProducts = (req, res, next) => {
    res.render("shop", {pageTitle: "My Shop", products: products, page: "shop"});
}

exports.getAddProduct = getAddProduct;
exports.postAddProduct = postAddProduct;
exports.getProducts = getProducts;
exports.products = products;