const mongoose = require("mongoose");
const {Schema} = mongoose;

const messageSchema = new Schema({
  content: {
    type: String, required: true
  },
  user: {
    type: Schema.Types.ObjectId, ref: "User", required: true
  },
  room: {
    type: Schema.Types.ObjectId, ref: "Room", required: true
  }
}, {timestamps: true});

module.exports = mongoose.model("Message", messageSchema);