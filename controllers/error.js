const get404Page = (req, res, next) => {
  res.status(404).render("404", {
    page: "404",
    pageTitle: "Page not found!",
    isAuthenticated: req.session.isLoggedIn,
  });
};

const get500Page = (req, res, next) => {
  res.status(500).render("500", {
    page: "500",
    pageTitle: "Something went wrong!",
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.get404Page = get404Page;
exports.get500Page = get500Page;
