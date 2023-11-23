const express = require("express");
const path = require("path");
const rootDir = require("../utils/path");

const Router = express.Router();

Router.get("/users", (req, res, next) => {
    res.send("<h1>Users</h1>")
});

Router.get("/", (req, res, next) => {
    res.sendFile(path.join(rootDir, "views", "shop.html"));
});

module.exports = Router;