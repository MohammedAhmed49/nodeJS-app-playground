const getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login",
    page: "login",
  });
};

exports.getLogin = getLogin;
