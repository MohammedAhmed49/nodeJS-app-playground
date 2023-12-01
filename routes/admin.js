const express = require("express");
const path = require("path");
const rootDir = require("../utils/path");

const Router = express.Router();

const products = [];

Router.get("/add-product", (req, res, next) => {
    res.render("add-product", {page: "add-product"})
});

Router.post("/add-product", (req, res, next) => {
    products.push({title: req.body.title});
    res.redirect("/");
});

exports.router = Router;
exports.products = products;