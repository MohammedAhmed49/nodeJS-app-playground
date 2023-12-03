const express = require("express");
const path = require("path");

const bodyParser = require("body-parser");
const adminData = require("./routes/admin");
const shopRouter = require("./routes/shop");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views")

app.use(express.static(path.join(__dirname, "public")))

app.use(bodyParser.urlencoded({extended: true}))

app.use('/admin',adminData.router);
app.use(shopRouter);

app.use((req, res, next) => {
    res.status(404).render("404", {page: "404", pageTitle: "Page not found!"}); 
})



app.listen(3000);