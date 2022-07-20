const User = require("../models/user");
const passport = require("passport");

const getUserParams = body => {
  return {
    name: body.name,
    email: body.email,
    password: body.password,
  };
};

module.exports = {
  new: (req, res) => {
    res.render("users/new");
  },
  create: (req, res, next) => {
    let newUser = new User(getUserParams(req.body));

    User.register(newUser, req.body.password, (error, user) => {
      if (user) {
        console.log("new user created!");
        res.locals.redirect = `/users/new`; // 仮のリダイレクト先
        next();
      } else {
        res.locals.redirect = "/users/new";
        next();
      }
    });
  },
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },
  login: (req, res) => {
    res.render("users/login");
  },
  authenticate: passport.authenticate("local", {
    failureRedirect: "/users/login",
    successRedirect: "/users/new",
  }),
  logout: (req, res, next) => {
    req.logout();
    res.locals.redirect = "/users/login";
    next();
  },
  show: (req, res, next) => {
    User.findById(req.params.id)
      .then(user => {
        res.locals.user = user;
        next();
      })
      .catch(error => {
        console.log(`Error occurred in users#show : ${error.message}`);
        next(error);
      })
  },
  showView: (req, res) => {
    res.render("users/show");
  }
}