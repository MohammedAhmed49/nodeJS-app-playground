const User = require("../models/user");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendGridTrans = require("nodemailer-sendgrid-transport");
const crypto = require("crypto");
const { validationResult } = require("express-validator");

const transporter = nodemailer.createTransport(
  sendGridTrans({
    auth: {
      api_key: process.env.SEND_GRID_API_KEY,
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
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    return res.status(422).render("auth/signup", {
      page: "signup",
      pageTitle: "Sign Up",
      errorMessage: errors.array()[0].msg,
    });
  }

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
};

const postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/login", {
      page: "login",
      pageTitle: "Login",
      errorMessage: errors.array()[0].msg,
    });
  }
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
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
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

const getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({
    resetPasswordToken: token,
    resetPasswordTokenExpiryDate: { $gt: Date.now() },
  })
    .then((user) => {
      if (!user) {
        req.flash("error", "Token is expired");
        return res.redirect("/reset-password");
      }
      let message = req.flash("error");
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      return res.render("auth/new-password", {
        pageTitle: "New Password",
        page: "newPassword",
        userId: user._id.toString(),
        passwordToken: token,
        errorMessage: message,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

const postResetPassword = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset-password");
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("error", "Email doesn't exist!");
          return res.redirect("/reset-password");
        }
        user.resetPasswordToken = token;
        user.resetPasswordTokenExpiryDate = Date.now() + 360000;
        return user.save().then((result) => {
          res.redirect("/login");
          console.log(process.env.SEND_GRID_API_KEY);
          transporter.sendMail({
            to: req.body.email,
            from: "mo.ahmed499@gmail.com",
            subject: "Reset password",
            html: `<p>You requested to reset your password!</p>
                  <p>To reset your password click on this <a href="http://localhost:3000/reset-password/${token}">link</a>.</p>
              `,
          });
        });
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/reset");
      });
  });
};

const postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;

  User.findOne({
    resetPasswordToken: passwordToken,
    resetPasswordTokenExpiryDate: { $gt: Date.now() },
    _id: userId,
  })
    .then((user) => {
      if (!user) {
        return res.redirect("/reset-password");
      }
      return bcrypt
        .hash(newPassword, 12)
        .then((hashedPassword) => {
          user.password = hashedPassword;
          user.resetPasswordToken = undefined;
          user.resetPasswordTokenExpiryDate = undefined;
          return user.save();
        })
        .then(() => {
          res.redirect("/login");
        });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getSignup = getSignup;
exports.getLogin = getLogin;
exports.getResetPassword = getResetPassword;
exports.getNewPassword = getNewPassword;
exports.postSignup = postSignup;
exports.postLogin = postLogin;
exports.postLogout = postLogout;
exports.postResetPassword = postResetPassword;
exports.postNewPassword = postNewPassword;
