const path = require("path");
const fs = require("fs");

const filePath = path.join(path.dirname(require.main.filename), "data", "cart.json");

class Cart {
    static addProductToCart(id, productPrice) {
        // Fetch cart products
        fs.readFile(filePath, (err, fileContent) => {
            let cart = {products: [], totalPrice: 0};
            if(!err) {
                cart = JSON.parse(fileContent);
            }
            // Check if the product is already in cart
            const existingProductIndex = cart.products.findIndex(item => item.id === id);
            const existingProduct = cart.products[existingProductIndex];

            let updatedProduct;
            // Add product to cart OR increase the quantity
            if(existingProduct) {
                updatedProduct = {...existingProduct};
                updatedProduct.qty++;
                cart.products = [...cart.products];
                cart.products[existingProduct] = updatedProduct;
            } else {
                updatedProduct = {id: id, qty: 1};
                cart.products = [...cart.products, updatedProduct];
            }
            cart.totalPrice += +productPrice;
            fs.writeFile(filePath, JSON.stringify(cart), (err) => {
                console.log(err);
            })
        })
    }
}

module.exports = Cart;