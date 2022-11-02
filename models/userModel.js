const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("mongoose-unique-validator");

const userModel = new Schema({
  // userid: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  sub: { type: Array, required: true },
});

userModel.plugin(validator);
module.exports = mongoose.model("Usermodel", userModel);
