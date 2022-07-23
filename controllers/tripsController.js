const fs = require("fs");

const Trip = require("../models/trip");
const Fish = require("../models/fish");

const getTripParams = (body) => {
  return {
    title: body.title,
    prefecture: body.prefecture,
    content: body.content,
  };
};

const getFishParams = (req, i) => {
  if (req.files) {
    if (req.files[`fishImage_${i}`]) {
      return {
        name: req.body.fishName[i],
        image: req.files[`fishImage_${i}`].md5,
      }
    }
  }
  return {
    name: req.body.fishName[i],
    image: null
  };
};

module.exports = {
  index: (req, res, next) => {
    Trip.find({})
      .populate({path: "user"})
      .populate({path: "fishes"})
      .then(trips => {
        res.locals.trips = trips;
        res.locals.num = trips.length;
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
    res.render("trips/new");
  },
  create: (req, res, next) => {
    let newTripParams = {
      title: req.body.title,
      prefecture: req.body.prefecture,
      content: req.body.content,
      user: req.user,
      fishes: []
    };
    let newTrip = new Trip(newTripParams);
    console.log(req.body.fishName);
    // 釣果の投稿があった場合はfishデータの保存も行う
    if (req.body.fishName) {
      // req.body.fishNameは一つのフォーム送信された場合文字列で、複数では配列になる
      let submittedFishNum = (typeof(req.body.fishName) === "string") ? 1 : req.body.fishName.length;
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
    newTrip.save();
    console.log("new Trip created!!");
    console.log(newTrip);
    res.locals.redirect = "/trips";
    next();
  },
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },
}