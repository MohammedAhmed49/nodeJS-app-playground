const getErrorPage = (req, res, next) => {
  res.status(404).render("404", {
    page: "404",
    pageTitle: "Page not found!",
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.getErrorPage = getErrorPage;
