const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const adminroutes = require("./routes/admin-routes");
const mongoose = require("mongoose");

app.use("/api/admin", adminroutes);

app.use(bodyParser.urlencoded({ extended: false }));
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "unknown error occured" });
});
mongoose
  .connect(
    "mongodb+srv://vibhavsharma:vib33156@cluster0.9li7ueb.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
