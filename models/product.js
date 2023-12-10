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
    constructor(title) {
        this.title = title;
    }

    save() {
        getProductsFromFile(products => {
            products.push(this);
            fs.writeFile(filePath, JSON.stringify(products), (error) => {
                console.log(error);
            });
        })
    }

    static fetchAllProducts(callbackFn) {
        getProductsFromFile(callbackFn);
    }
}

module.exports = Product;