const User = require("../models/user");

const getSignup = (req, res, next) => {
  res.render("auth/signup", {
    page: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false,
  });
};

const getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login",
    page: "login",
    isAuthenticated: req.session.isLoggedIn,
  });
};

const postSignup = (req, res, next) => {};

const postLogin = (req, res, next) => {
  User.findById("662ec6eb68d9b2983dc8e4ee")
    .then((user) => {
      req.session.user = user;
      req.session.isLoggedIn = true;
      req.session.save((err) => {
        console.log(err);
        res.redirect("/");
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

exports.getSignup = getSignup;
exports.getLogin = getLogin;
exports.postSignup = postSignup;
exports.postLogin = postLogin;
exports.postLogout = postLogout;
