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
        return db.execute("insert into products (title, price, description, imageUrl) values (?, ?, ?, ?)",[this.title,this.price,this.description, this.imageUrl]);
    }

    static fetchAllProducts() {
        return db.execute("select * from products");
    }

    static getProductById(id) {
        return db.execute(`select * from products where products.id = ?`, [id]);
    }

    static deleteProduct(id) {

    }
}

module.exports = Product;