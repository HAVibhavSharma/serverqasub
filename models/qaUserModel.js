const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const qaUserModel = new Schema({
  userid: { type: String, required: true },
  username: { type: String, required: true },
  qPointer: { type: Number, required: true },
  sub: { type: Array, required: true },
});

module.exports = mongoose.model("QAusermodel", qaUserModel);
