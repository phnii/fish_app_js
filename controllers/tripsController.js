const fs = require("fs");

const Trip = require("../models/trip");
const Fish = require("../models/fish");

const dateFormat = require("../dateFormat");

const getTripParams = (body) => {
  return {
    title: body.title,
    prefecture: body.prefecture,
    content: body.content,
  };
};

const authenticateUser = (req, res) => {
  if (!req.user) {
    res.redirect("/users/login");
  }
}

const updateTripAttributes = (body, trip) => {
  trip.title = body.title;
  trip.content = body.content;
  trip.prefecture = body.prefecture;
  trip.save();
}

const getFishParams = (req, i) => {
  if (req.files) {
    if (req.files[`fishImage_${i}`]) {
      return {
        name: (typeof(req.body.fishName) === "string") ? req.body.fishName : req.body.fishName[i],
        image: req.files[`fishImage_${i}`].md5,
      }
    }
  }
  return {
    name: (typeof(req.body.fishName) === "string") ? req.body.fishName : req.body.fishName[i],
    image: null
  };
};

module.exports = {
  index: (req, res, next) => {
    Trip.find({})
      .populate({path: "user"})
      .populate({path: "fishes"})
      .then(trips => {
        res.locals.trips = trips.slice().reverse();
        res.locals.num = trips.length;
        res.locals.dateFormat = dateFormat;
        next()
      })
      .catch(error => {
        console.log(`Error occurred in trips#index`);
        next(error);
      })
  },
  indexView: (req, res) => {
    res.render("trips/index2");
  },
  new: (req, res) => {
    authenticateUser(req, res);

    res.render("trips/new");
  },
  create: (req, res, next) => {
    if (req.skip) return next();
    authenticateUser(req, res);
    let newTripParams = {
      title: req.body.title,
      prefecture: req.body.prefecture,
      content: req.body.content,
      user: req.user,
      fishes: [],
      comments: []
    };
    let newTrip = new Trip(newTripParams);
    // 釣果の投稿があった場合はfishデータの保存も行う
    if (req.body.fishName) {
      // req.body.fishNameは一つのフォーム送信された場合文字列で、複数では配列になる
      let submittedFishName = (typeof(req.body.fishName) === "string") ? [req.body.fishName] : req.body.fishName;
      let submittedFishNum = submittedFishName.length;
      for (let i = 0; i < submittedFishNum; i++) {
        let newFish = new Fish(Object.assign(getFishParams(req, i), {trip: newTrip._id}));
        console.log(newFish);
        if (req.files) {
          if (req.files[`fishImage_${i}`]) {
            fs.writeFile("./public/uploads/" + req.files[`fishImage_${i}`].md5, 
              req.files[`fishImage_${i}`].data, (err) => console.log(err));
            newFish.toObject().image = req.files[`fishImage_${i}`].md5;
            console.log(newFish);
          }
        }
        newFish.save();
        newTrip.fishes.push(newFish._id);
      }
    }
    newTrip.save().then(trip => {
      req.user.trips.push(trip._id);
      req.user.save();
      console.log("new trip here");
      console.log(trip);
      res.locals.redirect = "/trips";
      next();
    });
  },
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },
  show: (req, res, next) => {
    res.locals.dateFormat = dateFormat;
    Trip.findById(req.params.id)
      .populate({path: "user"})
      .populate({path: "fishes"})
      .populate({path: "comments", populate: {path: "user"}})
      .then(trip => {
        res.locals.trip = trip;
        next();
      })
      .catch(error => {
        console.log(error);
        next(error);
      })
  },
  showView: (req, res) => {
    res.render("trips/show");
  },
  edit: (req, res, next) => {
    authenticateUser(req, res);
    Trip.findById(req.params.id)
      .populate({path: "user"})
      .populate({path: "fishes"})
      .then(trip => {
        if (req.user._id.toString() !== trip.user._id.toString()) {
          res.status(403);
          res.render("403");
        } else {
          res.locals.trip = trip;
          res.render("trips/edit");
        }
      })
      .catch(error => {
        console.log(error);
        next(error);
      })
  },
  update: (req, res, next) => {
    if (req.skip) return next();
    authenticateUser(req, res);
    Trip.findById(req.params.id)
    .then(trip => {
      if (trip.user._id.toString() !== req.user._id.toString()) {
        res.status(403);
        res.render("403");
      } else {
      updateTripAttributes(req.body, trip);
      if (req.body.deleteCheckBox) {
        // 釣果の削除があれば削除をする
        // deleteCheckBoxのチェックボックスが一つしかチェックされなかった時でも配列になるように変換する
        let deleteCheckBoxArray = (typeof(req.body.deleteCheckBox) === "string") ? [req.body.deleteCheckBox] : req.body.deleteCheckBox;
        deleteCheckBoxArray.forEach(async(deletedFish) => {
          await Fish.findByIdAndRemove(deletedFish)
          let updatedFishes = trip.fishes.filter(fish => {
            return deletedFish.toString() !== fish._id.toString();
          })
          trip.fishes = updatedFishes;
        });
        trip.save();
      }
      res.locals.trip = trip;
      res.locals.redirect = `/trips/${trip._id}`;
      if (req.body.fishName) {
        // req.body.fishNameは一つのフォーム送信された場合文字列で、複数では配列になる
        let submittedFishName = (typeof(req.body.fishName) === "string") ? [req.body.fishName] : req.body.fishName;
        let submittedFishNum = submittedFishName.length;
        for (let i = 0; i < submittedFishNum; i++) {
          let newFish = new Fish(Object.assign(getFishParams(req, i), {trip: trip._id}));
          console.log(newFish);
          if (req.files) {
            if (req.files[`fishImage_${i}`]) {
              fs.writeFile("./public/uploads/" + req.files[`fishImage_${i}`].md5, 
                req.files[`fishImage_${i}`].data, (err) => console.log(err));
              newFish.toObject().image = req.files[`fishImage_${i}`].md5;
            }
          }
          newFish.save();
          trip.fishes.push(newFish._id);
          trip.save();
        }
      }}
      next();
    })
    .catch(error => {
      console.log(`Error occurred in trips#update: ${error}`);
      next(error);
    })
  },
  delete: (req, res, next) => {
    authenticateUser(req, res);
    Trip.findById(req.params.id)
      .then(trip => {
        if (trip.user._id.toString() !== req.user._id.toString()) {
          res.status(401);
          res.render("401");
        } else {
          trip.remove();
          res.locals.redirect = "/trips";
          next();
        }
      })
  },
  search: (req, res, next) => {
    if (!req.body.fishName) {
      res.locals.trips = new Set();
      return next();
    }
    // 検索された魚名のFishを持つTripを重複しないように取得
    Fish.find({"name": req.body.fishName})
      .populate({path: "trip", populate: {path: "user"}} )
      .then(fishes => {
        let trips = new Set();
        fishes.forEach(fish => {
          trips.add(fish.trip);
        })
        res.locals.trips = trips;
        next();
      })
      .catch(error => {
        console.log(`Error occurred in trips#search: ${error}`);
        next(error);
      })
  },
  searchView: (req, res) => {
    res.render("trips/search");
  },
  validate: (req, res, next) => {
    req.check("title", "タイトルを入力してください").notEmpty();
    req.check("prefecture", "都道府県が不正です").notEmpty().isInt();
    req.check("content", "内容は3000字以内で入力してください").isLength({
      min: 0,
      max: 3000
    });
    req.check("fishName").custom(fishName => {
      fishName = (typeof(fishName) === "string") ? [fishName] : fishName;
      for (let i = 0; i < fishName.length; i++) {
        return new Promise((resolve, reject) => {
          if (fishName[i].match(/^[ァ-ヶー　]*$/)) {
            return resolve();
          } else {
            return reject();
          }
        })
      };
    }).withMessage("魚名は全角カタカナで入力してください");

    req.getValidationResult().then(error => {
      if (!error.isEmpty()) {
        let messages = error.array().map(e => e.msg);
        req.skip = true;
        console.log(messages);
        res.locals.redirect = "/trips/new";
        next();
      } else {
        next();
      }
    }); 
  }
}