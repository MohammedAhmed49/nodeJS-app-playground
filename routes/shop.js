const express = require("express");
const path = require("path");
const rootDir = require("../utils/path");
const adminData = require('./admin');

const Router = express.Router();

Router.get("/users", (req, res, next) => {
    res.send("<h1>Users</h1>")
});

Router.get("/", (req, res, next) => {
    res.render("shop", {title: "My Shop", products: adminData.products});
});

module.exports = Router;