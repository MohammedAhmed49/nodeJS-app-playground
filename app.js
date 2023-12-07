const express = require("express");
const path = require("path");

const bodyParser = require("body-parser");
const adminRouter = require("./routes/admin");
const shopRouter = require("./routes/shop");
const { getErrorPage } = require("./controllers/error");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views")

app.use(express.static(path.join(__dirname, "public")))

app.use(bodyParser.urlencoded({extended: true}))

app.use('/admin', adminRouter);
app.use(shopRouter);

app.use(getErrorPage);

app.listen(3000);