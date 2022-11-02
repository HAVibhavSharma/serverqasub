const express = require("express");
const { model } = require("mongoose");
const user = require("../controllers/userpage");
const router = express.Router();
const bodyParser = require("body-parser");

router.use(bodyParser.json());

router.post("/signup", user.signup);

router.get("/", user.getUserList);

router.post("/login", user.login);

module.exports = router;
