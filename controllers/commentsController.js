const Comment = require("../models/comment");
const Trip = require("../models/trip");


module.exports = {
  create: (req, res, next) => {
    Trip.findById(req.params.id)
      .then(trip => {
        Comment.create({
          content: req.body.content,
          user: req.user._id,
          trip: req.params.id
        })
        .then(comment => {
          trip.comments.push(comment._id);
          trip.save();
          req.user.comments.push(comment._id);
          req.user.save();
          res.locals.redirect = `/trips/${trip._id}`;
          next();
        })
        .catch(error => {
          console.log(`Error occurred in comments#create: ${error}`);
          next(error);
        })
      })
      .catch(error => {
        console.log(`Error occurred in comments#create: ${error}`);
        next(error);
      })
  },
  delete: (req, res, next) => {
    Comment.findByIdAndRemove(req.params.commentId)
      .then(() => {
        res.locals.redirect = `/trips/${req.params.id}`;
        next();
      })
      .catch(error => {
        console.log(error);
        next(error);
      });
  }
}