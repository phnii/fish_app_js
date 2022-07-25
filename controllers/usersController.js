const User = require("../models/user");
const passport = require("passport");

const getUserParams = body => {
  return {
    name: body.name,
    email: body.email,
    password: body.password,
  };
};

const authenticateUser = (req, res) => {
  if (!req.user) {
    res.redirect("/users/login");
  }
}

module.exports = {
  new: (req, res) => {
    res.locals.messages = null;
    res.render("users/new");
  },
  create: (req, res, next) => {
    if (req.skip) {
      console.log(res.locals.messages);
      return next()
    }; //　前段階でバリデーションに引っかかった場合スキップ
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
    successRedirect: "/trips",
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
        res.locals.user = user;
        next(error);
      })
  },
  showView: (req, res) => {
    res.render("users/show");
  },
  follow: (req, res, next) => {
    authenticateUser(req, res);
    let follower = req.user;
    User.findById(req.params.id)
      .then(followed => {
        follower.followings.push(followed._id);
        follower.save();
        followed.followers.push(follower._id);
        followed.save();
        res.locals.redirect = `/users/${followed._id}/followers`;
        next();
      })
      .catch(error => {
        console.log(`Error occurred in users#follow: ${error.message}`);
        next(error);
      });
  },
  unfollow: (req, res, next) => {
    authenticateUser(req, res);
    res.locals.redirect = `/users/${req.params.id}`;
    User.findById(req.params.id)
      .then(followed => {
        let newFollowings = req.user.followings.filter(i => {
          return i.toString() !== followed._id.toString();
        });
        req.user.followings = newFollowings;
        req.user.save();
        let newFollowers = followed.followers.filter(i => {
          return i.toString() !== req.user._id.toString();
        })
        followed.followers = newFollowers;
        followed.save();
        res.locals.redirect = `/users/${followed._id}/followers`;
        next();
      })
      .catch(error => {
        console.log(`Error occurred in users#unfollow: ${error.message}`);
        next(error);
      })
  },
  followers: (req, res, next) => {
    User.findById(req.params.id)
      .populate({path: "followers", populate: {path: "trips"}})
      .populate({path: "followings", populate: {path: "trips"}})
      .then(user => {
        res.locals.user = user;
        next();
      })
      .catch(error => {
        console.log(`Error occurred in users#show : ${error.message}`);
        res.locals.user = user;
        next(error);
      })
  },
  followersView: (req, res) => {
    res.render("users/followers");
  },
  validate: (req, res, next) => {
    req.sanitizeBody("email").normalizeEmail({
      all_lowercase: true
    }).trim();
    req.check("email", "不正なメールアドレスです")
    .isEmail()
    .custom((value) => {
       return new Promise((resolve, reject) => {
          User.findOne({ "email": value }, (error, user) => {
             if (user !== null) {
                return reject();
             } else {
                return resolve();
             }
          });
       });
    }).withMessage('このメールアドレスは登録済みです');
    req.check("name").notEmpty()
    .custom(value => {
      return new Promise((resolve, reject) => {
        User.findOne({"name": value}, (error, user) => {
          if (user !== null) {
            return reject();
          } else {
            return resolve();
          }
        });
      });
    }).withMessage("このユーザー名は登録済みです");
    req.check("password", "パスワードは8字以上入力してください").notEmpty().isLength({
      max: 256,
      min: 8
    });

    req.getValidationResult().then(error => {
      if (!error.isEmpty()) {
        let messages = error.array().map(e => e.msg);
        console.log(messages);
        req.skip = true;
        res.locals.redirect = "/users/new";
        res.locals.messages = messages;
        res.render("users/new");
      } else {
        next();
      }
    });
  }
}