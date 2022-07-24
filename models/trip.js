const mongoose = require("mongoose");
const {Schema} = mongoose;

const tripSchema = new Schema({
  title: {
    type: String,
    required: true,
    maxLength: 20
  },
  prefecture: {
    type: Number,
    required: true
  },
  content: {
    type: String,
    required: true,
    maxLength: 3000
  },
  fishes: [{type:Schema.Types.ObjectId, ref: "Fish"}],
  user: {type: Schema.Types.ObjectId, ref: "User", required: true},
  comments: [{type: Schema.Types.ObjectId, ref: "Comment"}]
}, {timestamps: true});

module.exports = mongoose.model("Trip", tripSchema);