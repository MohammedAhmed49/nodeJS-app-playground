const getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login",
    page: "login",
  });
};

const postLogin = (req, res, next) => {
  res.setHeader("Set-Cookie", { isLoggedIn: true });
  res.redirect("/");
};

exports.getLogin = getLogin;
exports.postLogin = postLogin;
