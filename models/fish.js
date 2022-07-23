const mongoose = require("mongoose");
const {Schema} = mongoose;

const fishSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
  },
  trip: {type: Schema.Types.ObjectId, ref: "Trip", required: true}
});

module.exports = mongoose.model("Fish", fishSchema);