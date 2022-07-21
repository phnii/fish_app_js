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
    type: Schema.Types.ObjectId, ref: "user"
  }],
  followings: [{
    type: Schema.Types.ObjectId, ref: "user"
  }]
});

userSchema.plugin(passportLocalMongoose, {
  usernameField: "email"
});

userSchema.methods.isFollowing = function(target) {
  for (let i = 0; i < this.followings.length; i++) {
    if (this.followings[i].toString() === target._id.toString())
      return true;
  }
  return false;
};

userSchema.methods.print = function() {
  return this.name;
};

module.exports = mongoose.model("User", userSchema);
