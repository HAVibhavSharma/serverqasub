const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Mathmodel = new Schema({
  id: { type: Number, required: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
});

module.exports = mongoose.model("Mathmodel", Mathmodel);
