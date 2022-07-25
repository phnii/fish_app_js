const Room = require("../models/room");
const User = require("../models/user");
const Message = require("../models/message");

const dateFormat = require("../dateFormat");

const authenticateUser = (req, res) => {
  if (!req.user) {
    res.status(401);
    res.render("401");
  }
  Room.findById(req.params.id)
    .then(room => {
      if (![room.user1._id.toString(), room.user2._id.toString()].includes(req.user._id.toString())) {
        res.status(401);
        res.render("401");
      }
    })
}

module.exports = {
  index: (req, res, next) => {
    authenticateUser(req, res);
    res.locals.dateFormat = dateFormat;
    res.locals.mutural = false;
    Room.findById(req.params.id)
      .populate({path: "messages", populate: {path: "user"}})
      .populate({path: "user1"})
      .populate({path: "user2"})
      .then(room => {
        res.locals.room = room;
        User.findById(room.user1._id).then(user1 => {
          User.findById(room.user2._id).then(user2 => {
            if (user1.isFollowing(user2) &&
            user2.isFollowing(user1)) {
              res.locals.mutural = true;
              return next();
            } else {
              return next();
            }
          })
        })
      })
  },
  indexView: (req, res) => {
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
      user2: req.body.user2,
      messages: []
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
  },
  sendMessage: (req, res, next) => {
    authenticateUser(req, res);
    let newMessage = {
      content: req.body.content,
      user: req.user._id,
      room: req.params.id
    };
    Room.findById(req.params.id)
    .then(room => {
      Message.create(newMessage)
      .then(message => {
        res.locals.redirect = `/rooms/${req.params.id}`;
        room.messages.push(message._id);
        console.log(room.messages);
        room.save()
        console.log(room);
        next();
      })
      .catch(error => {
        console.log(`Error occurred in rooms#sendMessage: ${error}`);
        next(error);
      })
    })
  },
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },
}