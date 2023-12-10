const path = require("path");
const fs = require("fs");

const filePath = path.join(path.dirname(require.main.filename), "data", "products.json");
class Product {
    constructor(title) {
        this.title = title;
    }

    save() {
        fs.readFile(filePath, (error, data) => {
            let products = [];
            if(!error) {
                products = JSON.parse(data);
            }
            products.push(this);
            fs.writeFile(filePath, JSON.stringify(products), (error) => {
                console.log(error);
            })
        })
    }

    static fetchAllProducts(callbackFn) {
        fs.readFile(filePath, (error, data) => {
            if (error) {
                callbackFn([]);
            } else {
                callbackFn(JSON.parse(data));
            }
        })
    }
}

module.exports = Product;