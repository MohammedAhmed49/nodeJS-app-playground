const User = require("../models/user");
const bcrypt = require("bcryptjs");

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

const postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        res.redirect("/signup");
      } else {
        return bcrypt
          .hash(password, 12)
          .then((hashedPassword) => {
            const user = new User({
              email: email,
              password: hashedPassword,
              cart: { items: [] },
            });

            return user.save();
          })
          .then(() => {
            res.redirect("/login");
          });
      }
    })
    .catch((err) => console.log(err));
};

const postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.redirect("/login");
      }
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (!doMatch) {
            return res.redirect("/login");
          }
          req.session.user = user;
          req.session.isLoggedIn = true;
          return req.session.save((err) => {
            console.log(err);
            res.redirect("/");
          });
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/login");
        });
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (!doMatch) {
            return res.redirect("/login");
          }
          req.session.user = user;
          req.session.isLoggedIn = true;
          return req.session.save((err) => {
            console.log(err);
            res.redirect("/");
          });
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/login");
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
