const getErrorPage = (req, res, next) => {
    res.status(404).render("404", {page: "404", pageTitle: "Page not found!"}); 
}

exports.getErrorPage = getErrorPage;