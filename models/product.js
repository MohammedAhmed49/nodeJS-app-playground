const path = require("path");
const fs = require("fs");

const filePath = path.join(path.dirname(require.main.filename), "data", "products.json");

const getProductsFromFile = (callbackFn) => {
    fs.readFile(filePath, (error, data) => {
        if (error) {
            callbackFn([]);
        } else {
            callbackFn(JSON.parse(data));
        }
    })
}
class Product {
    constructor(id, title, imageUrl, price, description) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.price = price;
        this.description = description;
        this.id = id;
    }

    save() {
        getProductsFromFile(products => {
            if(this.id) {
                const updatedProducts = [...products];
                const existingProductIndex = updatedProducts.findIndex(item => item.id === this.id);
                updatedProducts[existingProductIndex] = this;
                fs.writeFile(filePath, JSON.stringify(updatedProducts), (error) => {
                    console.log(error);
                });
            } else {
                this.id = Math.random().toString();
                products.push(this);
                fs.writeFile(filePath, JSON.stringify(products), (error) => {
                    console.log(error);
                });
            }
        })
    }

    static fetchAllProducts(callbackFn) {
        getProductsFromFile(callbackFn);
    }

    static getProductById(id, cb) {
        getProductsFromFile((products) => {
            const product = products.find(item => item.id === id);
            cb(product);
        })
    }
}

module.exports = Product;