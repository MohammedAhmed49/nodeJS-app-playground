const User = require("../models/user");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendGridTrans = require("nodemailer-sendgrid-transport");

const transporter = nodemailer.createTransport(
  sendGridTrans({
    auth: {
      api_key:
        "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",
    },
  })
);

const getSignup = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    page: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false,
    errorMessage: message,
  });
};

const getLogin = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
    pageTitle: "Login",
    page: "login",
    isAuthenticated: req.session.isLoggedIn,
    errorMessage: message,
  });
};

const postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        req.flash("error", "Email already exists");
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
            return transporter.sendMail({
              to: email,
              sender: "mo.ahmed499@gmail.com",
              subject: "Successful signup test",
              html: "<h1>Signed up successfully.</h1>",
            });
          })
          .catch((err) => console.log(err));
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
        req.flash("error", "Invalid email or password!");
        return res.redirect("/login");
      }
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (!doMatch) {
            req.flash("error", "Invalid email or password!");
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

const getResetPassword = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/reset-password", {
    pageTitle: "Reset Password",
    page: "reset",
    errorMessage: message,
  });
};

exports.getSignup = getSignup;
exports.getLogin = getLogin;
exports.getResetPassword = getResetPassword;
exports.postSignup = postSignup;
exports.postLogin = postLogin;
exports.postLogout = postLogout;
