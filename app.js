const express = require("express");
const path = require("path");

const bodyParser = require("body-parser");
const adminRouter = require("./routes/admin");
const shopRouter = require("./routes/shop");
const authRouter = require("./routes/auth");
const User = require("./models/user");
const { getErrorPage } = require("./controllers/error");
const mongoose = require("mongoose");
const session = require("express-session");
const MongodbStore = require("connect-mongodb-session")(session);

const MONGODB_URI =
  "mongodb+srv://mohammed:123@cluster0.qkxwsji.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0";

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const store = new MongodbStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use("/admin", adminRouter);
app.use(shopRouter);
app.use(authRouter);

app.use(getErrorPage);

mongoose.connect(MONGODB_URI).then((result) => {
  app.listen(3000);
});
