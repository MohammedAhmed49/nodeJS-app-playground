const express = require("express");
const path = require("path");

const bodyParser = require("body-parser");
const adminRouter = require("./routes/admin");
const shopRouter = require("./routes/shop");
const User = require("./models/user");
const { getErrorPage } = require("./controllers/error");
const { mongoConnect } = require("./utils/database");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  User.findById("661986657d61a22131fc9d1d")
    .then((user) => {
      req.user = new User(user.name, user.email, user.cart, user._id);
      next();
    })
    .catch((err) => {
      console.log(err);
      // next();
    });
});

app.use("/admin", adminRouter);
app.use(shopRouter);

app.use(getErrorPage);

mongoConnect(() => {
  app.listen(3000);
});
