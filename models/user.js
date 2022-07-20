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
  }
});

userSchema.plugin(passportLocalMongoose, {
  usernameField: "email"
});
module.exports = mongoose.model("User", userSchema);
