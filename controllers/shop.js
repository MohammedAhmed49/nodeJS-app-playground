const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const Order = require("../models/order");
const Product = require("../models/product");

const itemsPerPage = 1;

const getIndex = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;

  Product.find()
    .countDocuments()
    .then((productsCount) => {
      totalItems = productsCount;
      return Product.find()
        .skip((page - 1) * itemsPerPage)
        .limit(itemsPerPage);
    })
    .then((products) => {
      res.render("shop/index", {
        pageTitle: "My Shop",
        prods: products,
        page: "shop",
        isAuthenticated: req.session.isLoggedIn,
        csrfToken: req.csrfToken(),
        currentPage: page,
        hasNextPage: itemsPerPage * page < totalItems,
        hasPrevPage: page > 1,
        nextPage: page + 1,
        prevPage: page - 1,
        lastPage: Math.ceil(totalItems / itemsPerPage),
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

const getProducts = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;

  Product.find()
    .countDocuments()
    .then((productsCount) => {
      totalItems = productsCount;
      return Product.find()
        .skip((page - 1) * itemsPerPage)
        .limit(itemsPerPage);
    })
    .then((products) => {
      res.render("shop/product-list", {
        pageTitle: "All Products",
        prods: products,
        page: "products",
        csrfToken: req.csrfToken(),
        currentPage: page,
        hasNextPage: itemsPerPage * page < totalItems,
        hasPrevPage: page > 1,
        nextPage: page + 1,
        prevPage: page - 1,
        lastPage: Math.ceil(totalItems / itemsPerPage),
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

const getProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.findById(productId)
    .then((product) => {
      res.render("shop/product-detail", {
        pageTitle: product.title,
        page: "products",
        product: product,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

const getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    // .execPopulate()
    .then((user) => {
      const products = user.cart.items;
      console.log("products", products);
      res.render("shop/cart", {
        pageTitle: "My Cart",
        products: products,
        page: "cart",
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

const postCart = (req, res, next) => {
  const productId = req.body.productId;
  Product.findById(productId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      console.log(result);
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

const postCreateOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((i) => {
        return { quantity: i.quantity, productData: { ...i.productId._doc } };
      });
      const order = new Order({
        products: products,
        user: {
          email: req.user.email,
          userId: req.user,
        },
      });
      return order.save();
    })
    .then(() => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

const getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id }).then((orders) => {
    res.render("shop/orders", {
      pageTitle: "My Cart",
      page: "cart",
      orders: orders,
      isAuthenticated: req.session.isLoggedIn,
    });
  });
};

const getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    pageTitle: "My Checkout",
    page: "checkout",
    isAuthenticated: req.session.isLoggedIn,
  });
};

const deleteCartItem = (req, res, next) => {
  const productId = req.body.productId;
  req.user
    .deleteCartItem(productId)
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

const getInvoiceFile = (req, res, next) => {
  const orderId = req.params.orderId;

  Order.findById(orderId)
    .then((order) => {
      if (!order) {
        return next(new Error("No order found."));
      }
      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error("Unauthorized."));
      }
      const fileName = "invoice-" + orderId + ".pdf";
      const filePath = path.join("data", "invoices", fileName);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `inline; filename="${fileName}"`);

      const pdfDoc = new PDFDocument();
      pdfDoc.pipe(fs.createWriteStream(filePath));
      pdfDoc.pipe(res);

      pdfDoc.fontSize(18).text("Invoice");
      pdfDoc.fontSize(16).text("--------------");

      let totalPrice = 0;
      order.products.forEach((product) => {
        totalPrice += product.quantity * product.productData.price;
        pdfDoc
          .fontSize(14)
          .text(
            product.productData.title +
              " - " +
              product.quantity +
              " x " +
              "$" +
              product.productData.price
          );
      });
      pdfDoc.fontSize(16).text("--------------");
      pdfDoc.fontSize(16).text("Total price: $" + totalPrice);
      pdfDoc.end();

      // Sending the file after all the buffers are done

      // fs.readFile(filePath, (error, data) => {
      //   if (error) {
      //     return next(error);
      //   }
      //   res.setHeader("Content-Type", "application/pdf");
      //   res.setHeader("Content-Disposition", `inline; filename="${fileName}"`);
      //   res.send(data);
      // });

      // Streaming the file chunk by chunk

      // const file = fs.createReadStream(filePath);

      // file.pipe(res);
    })
    .catch((err) => {
      return next(err);
    });
};

exports.getIndex = getIndex;
exports.getProducts = getProducts;
exports.getProduct = getProduct;
exports.getCart = getCart;
exports.getCheckout = getCheckout;
exports.getInvoiceFile = getInvoiceFile;
exports.getOrders = getOrders;
exports.postCart = postCart;
exports.deleteCartItem = deleteCartItem;
exports.postCreateOrder = postCreateOrder;
