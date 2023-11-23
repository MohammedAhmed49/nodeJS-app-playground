const express = require("express");
const path = require("path");
const rootDir = require("../utils/path");

const Router = express.Router();

Router.get("/add-product", (req, res, next) => {
    res.sendFile(path.join(rootDir, "views", "add-product.html"))
});

Router.post("/new-user", (req, res, next) => {
    console.log(req.body);
    res.redirect("/");
});

module.exports = Router;