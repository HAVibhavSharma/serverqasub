const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SubjectCounter = new Schema({
  subject: { type: String, required: true },
  counter: { type: Number, required: true },
  daily: { type: Number, required: true },
});

module.exports = mongoose.model("SubjectCounter", SubjectCounter);
