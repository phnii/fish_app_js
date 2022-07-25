const mongoose = require("mongoose");
const {Schema} = mongoose;

const roomSchema = new Schema({
  user1: {
    type: Schema.Types.ObjectId, ref: "User"
  },
  user2: {
    type: Schema.Types.ObjectId, ref: "User"
  }
})

module.exports = mongoose.model("Room", roomSchema);