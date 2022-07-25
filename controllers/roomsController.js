const Room = require("../models/room");
const User = require("../models/user");

module.exports = {
  index: (req, res) => {
    res.render("rooms/index");
  },
  beforeCreate: (req, res, next) => {
    User.findById(req.body.user1)
      .then(user1 => {
        User.findById(req.body.user2)
          .then(user2 => {
            if (user1.hasARoomWith(user2)) {
              res.locals.redirect = `/rooms/${user1.hasARoomWith(user2)}` // 仮のアドレス
              console.log(res.redirect);
              res.locals.users = [user1, user2];
              res.skip = true;

              return next();
            } else if (user1.isFollowing(user2) && user2.isFollowing(user1)) {
              res.locals.users = [user1, user2];
              res.skip = false;
              return next();
            } else {
              res.status(401);
              res.render("401");
            }
          })
      })
  },
  create: (req, res, next) => {
    if (res.skip) {
      return next();
    }
    let newRoom = {
      user1: req.body.user1,
      user2: req.body.user2
    };
    Room.create(newRoom)
      .then(room => {
        res.locals.redirect = `/rooms/${room._id}`
        console.log(res.locals.users);
        res.locals.users[0].rooms.push(room._id);
        res.locals.users[1].rooms.push(room._id);
        res.locals.users[0].save()
        .then(() => {res.locals.users[1].save().then(() => {return next();})})
      })
  }
}