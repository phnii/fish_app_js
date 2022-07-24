const mongoose = require("mongoose");
const {Schema} = mongoose;

const commentSchema = new Schema({
  content: {
    type: String,
    required: true,
    maxLength: 500
  },
  user: {type: Schema.Types.ObjectId, ref: "User", required: true},
  trip: {type: Schema.Types.ObjectId, ref: "Trip", required: true}
}, {timestamps: true});

module.exports = mongoose.model("Comment", commentSchema);