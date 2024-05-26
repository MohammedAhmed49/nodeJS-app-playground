const express = require("express");
const path = require("path");
const csrf = require("csurf");
const flash = require("connect-flash");

require("dotenv").config();

const bodyParser = require("body-parser");
const adminRouter = require("./routes/admin");
const shopRouter = require("./routes/shop");
const authRouter = require("./routes/auth");
const User = require("./models/user");
const { get404Page, get500Page } = require("./controllers/error");
const mongoose = require("mongoose");
const session = require("express-session");
const multer = require("multer");
const MongodbStore = require("connect-mongodb-session")(session);

const MONGODB_URI = process.env.MONGODB_URI;

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const store = new MongodbStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

const csrfProtection = csrf();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: storage, fileFilter: fileFilter }).single("image"));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();

  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      throw new Error(err);
    });
});

app.use("/admin", adminRouter);
app.use(shopRouter);
app.use(authRouter);

app.use(get404Page);

app.use((error, req, res, next) => {
  res.status(500).render("500", {
    page: "500",
    pageTitle: "Something went wrong!",
    isAuthenticated: req.session.isLoggedIn,
  });
});

mongoose.connect(MONGODB_URI).then((result) => {
  app.listen(3000);
});
