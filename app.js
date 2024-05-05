const express = require("express");
const path = require("path");

const bodyParser = require("body-parser");
const adminRouter = require("./routes/admin");
const shopRouter = require("./routes/shop");
const authRouter = require("./routes/auth");
const User = require("./models/user");
const { getErrorPage } = require("./controllers/error");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  User.findById("662ec6eb68d9b2983dc8e4ee")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
      // next();
    });
});

app.use("/admin", adminRouter);
app.use(shopRouter);
app.use(authRouter);

app.use(getErrorPage);

mongoose
  .connect(
    "mongodb+srv://mohammed:123@cluster0.qkxwsji.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then((result) => {
    User.findOne().then((res) => {
      if (!res) {
        const user = new User({
          name: "Mohammed",
          email: "test@tes.co",
          cart: [],
        });

        user.save();
      }
    });
    app.listen(3000);
  });
