const mongoose = require("mongoose");
const {Schema} = mongoose;
const passportLocalMongoose = require("passport-local-mongoose");


const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  introduce: {
    type: String
  },
  followers: [{
    type: Schema.Types.ObjectId, ref: "User"
  }],
  followings: [{
    type: Schema.Types.ObjectId, ref: "User"
  }],
  trips: [{
    type: Schema.Types.ObjectId, ref: "Trip"
  }],
  comments: [{
    type: Schema.Types.ObjectId, ref: "Comment"
  }],
  rooms: [{
    type: Schema.Types.ObjectId, ref: "Room"
  }]
});

userSchema.plugin(passportLocalMongoose, {
  usernameField: "email"
});

userSchema.methods.isFollowing = function(target) {
  for (let i = 0; i < this.followings.length; i++) {
    if (this.followings[i]._id.toString() === target._id.toString())
      return true;
  }
  return false;
};

userSchema.methods.hasARoomWith = function(anotherUser) {
  for (let i = 0; i < this.rooms.length; i++) {
    if (anotherUser.rooms.includes(this.rooms[i]._id)) {
      return this.rooms[i]._id;
    }
  }
  return false;
}

module.exports = mongoose.model("User", userSchema);
