const Cart = require("./cart");
const db = require("../utils/database");

class Product {
    constructor(id, title, imageUrl, price, description) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.price = price;
        this.description = description;
        this.id = id;
    }

    save() {
        
    }

    static fetchAllProducts(callbackFn) {
    }

    static getProductById(id, cb) {

    }

    static deleteProduct(id) {

    }
}

module.exports = Product;