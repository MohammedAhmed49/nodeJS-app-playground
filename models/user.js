const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetPasswordToken: String,
  resetPasswordTokenExpiryDate: Date,
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product) {
  const cartProductIndex = this.cart.items.findIndex((currentProduct) => {
    return currentProduct.productId.toString() === product._id.toString();
  });
  const updatedCartItems = [...this.cart.items];
  let newQuantity = 1;

  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: newQuantity,
    });
  }

  const updatedCart = {
    items: updatedCartItems,
  };

  this.cart = updatedCart;

  return this.save();
};

userSchema.methods.deleteCartItem = function (productId) {
  const updatedCartItems = [
    ...this.cart.items.filter(
      (i) => i.productId.toString() !== productId.toString()
    ),
  ];
  this.cart.items = [...updatedCartItems];

  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

module.exports = mongoose.model("User", userSchema);

// const mongodb = require("mongodb");
// const { getDb } = require("../utils/database");

// class User {
//   constructor(username, email, cart, _id) {
//     this.username = username;
//     this.email = email;
//     this.cart = cart;
//     this._id = _id;
//   }

//   save() {
//     const db = getDb();
//     return db.collection("users").insertOne(this);
//   }

//   addToCart(product) {
//     const cartProductIndex = this.cart.items.findIndex((currentProduct) => {
//       return currentProduct.productId.toString() === product._id.toString();
//     });
//     const updatedCartItems = [...this.cart.items];
//     let newQuantity = 1;

//     if (cartProductIndex >= 0) {
//       newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//       updatedCartItems[cartProductIndex].quantity = newQuantity;
//     } else {
//       updatedCartItems.push({
//         productId: new mongodb.ObjectId(product._id),
//         quantity: newQuantity,
//       });
//     }

//     const updatedCart = {
//       items: updatedCartItems,
//     };

//     const db = getDb();

//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new mongodb.ObjectId(this._id) },
//         { $set: { cart: updatedCart } }
//       );
//   }

//   getCart() {
//     const db = getDb();
//     const productIds = this.cart.items.map((i) => {
//       return i.productId;
//     });
//     return db
//       .collection("products")
//       .find({ _id: { $in: productIds } })
//       .toArray()
//       .then((products) => {
//         return products.map((p) => {
//           return {
//             ...p,
//             quantity: this.cart.items.find(
//               (i) => p._id.toString() === i.productId.toString()
//             ).quantity,
//           };
//         });
//       });
//   }

//   deleteCartItem(productId) {
//     const db = getDb();

//     const updatedCartItems = [
//       ...this.cart.items.filter(
//         (i) =>
//           i.productId.toString() !== new mongodb.ObjectId(productId).toString()
//       ),
//     ];

//     this.cart.items = [...updatedCartItems];

//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new mongodb.ObjectId(this._id) },
//         { $set: { cart: this.cart } }
//       );
//   }

//   addOrder() {
//     const db = getDb();

//     return this.getCart().then((products) => {
//       const order = {
//         products: products,
//         user: { _id: new mongodb.ObjectId(this._id), name: this.username },
//       };
//       return db
//         .collection("orders")
//         .insertOne(order)
//         .then((result) => {
//           this.cart.items = [];
//           return db
//             .collection("users")
//             .updateOne(
//               { _id: new mongodb.ObjectId(this._id) },
//               { $set: { cart: this.cart } }
//             );
//         });
//     });
//   }

//   getOrders() {
//     const db = getDb();
//     return db
//       .collection("orders")
//       .find({ "user._id": new mongodb.ObjectId(this._id) })
//       .toArray()
//       .then((orders) => orders);
//   }

//   static findById(userId) {
//     const db = getDb();

//     return db
//       .collection("users")
//       .findOne({ _id: new mongodb.ObjectId(userId) })
//       .then((product) => {
//         return product;
//       });
//   }
// }

// module.exports = User;
