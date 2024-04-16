const mongodb = require("mongodb");
const { getDb, mongoConnect } = require("../utils/database");

class Product {
  constructor(title, price, imageUrl, description, userId) {
    this.title = title;
    this.price = price;
    this.imageUrl = imageUrl;
    this.description = description;
    this.userId = userId;
  }

  save() {
    const db = getDb();
    return db
      .collection("products")
      .insertOne(this)
      .then((result) => console.log(result))
      .catch((err) => console.log(err));
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection("products")
      .find()
      .toArray()
      .then((products) => {
        console.log(products);
        return products;
      })
      .catch((err) => console.log(err));
  }

  static fetchById(productId) {
    const db = getDb();
    return db
      .collection("products")
      .findOne({ _id: new mongodb.ObjectId(productId) })
      .then((product) => {
        console.log(product);
        return product;
      });
  }

  static deleteProduct(productId) {
    const db = getDb();
    return db
      .collection("products")
      .deleteOne({ _id: new mongodb.ObjectId(productId) })
      .then((res) => res);
  }

  editProduct(productId) {
    const db = getDb();
    return db
      .collection("products")
      .updateOne({ _id: new mongodb.ObjectId(productId) }, { $set: this });
  }
}

module.exports = Product;
