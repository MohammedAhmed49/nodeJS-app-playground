// const Cart = require("../models/cart");
const Product = require("../models/product");

const getIndex = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render("shop/index", {
        pageTitle: "My Shop",
        prods: products,
        page: "shop",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const getProducts = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render("shop/product-list", {
        pageTitle: "All Products",
        prods: products,
        page: "products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const getProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.fetchById(productId)
    .then((product) => {
      res.render("shop/product-detail", {
        pageTitle: product.title,
        page: "products",
        product: product,
      });
    })
    .catch((err) => err);
};

const getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts().then((products) => {
        res.render("shop/cart", {
          pageTitle: "My Cart",
          products: products,
          page: "cart",
        });
      });
    })

    .catch((err) => console.log(err));
};

const postCart = (req, res, next) => {
  const productId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;

  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: productId } });
    })
    .then((products) => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }
      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;

        return product;
      }

      return Product.findByPk(productId);
    })
    .then((product) => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity },
      });
    })
    .then(() => res.redirect("/cart"));
};

const postCreateOrder = (req, res, next) => {
  let fetchedCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      return req.user.createOrder().then((order) => {
        return order.addProducts(
          products.map((product) => {
            product.orderItem = { quantity: product.cartItem.quantity };
            return product;
          })
        );
      });
    })
    .then(() => {
      return fetchedCart.setProducts(null);
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => err);
};

const getOrders = (req, res, next) => {
  req.user.getOrders({ include: ["products"] }).then((orders) => {
    res.render("shop/orders", {
      pageTitle: "My Cart",
      page: "cart",
      orders: orders,
    });
  });
};

const getCheckout = (req, res, next) => {
  res.render("shop/checkout", { pageTitle: "My Checkout", page: "checkout" });
};

const deleteCartItem = (req, res, next) => {
  const productId = req.body.productId;
  req.user
    .getCart()
    .then((cart) => cart.getProducts({ where: { id: productId } }))
    .then((products) => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.getIndex = getIndex;
exports.getProducts = getProducts;
exports.getProduct = getProduct;
exports.getCart = getCart;
exports.postCart = postCart;
exports.getCheckout = getCheckout;
exports.getOrders = getOrders;
exports.deleteCartItem = deleteCartItem;
exports.postCreateOrder = postCreateOrder;
