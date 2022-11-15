const usermodel = require("../models/userModel");
const HttpError = require("../models/http-error");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { response } = require("express");

const counter = require("../models/subcounter");
const BioQAModel = require("../models/Biology/qaModel");
const ChemQAModel = require("../models/Chemistry/qaModel");
const MathQAModel = require("../models/Math/qaModel");
const PhyQAModel = require("../models/Physics/qaModel");

const subjects = ["phy", "chem", "bio", "math"]; //fetch from database\

const addUser = async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const sub = req.body.sub;
  const userlogin = await usermodel.findOne({ email });
  if (userlogin) {
    return next(new HttpError("user found proceed to login ", 404));
  }
  try {
    let hashedpassword = await bcrypt.hash(password, 12);
    const user = new usermodel({
      username,
      email,
      password: hashedpassword,
      sub,
    });
    try {
      user.save();
    } catch (err) {
      console.log(err);
      return next(new HttpError("cannot create", 404));
    }
    let token;
    try {
      token = jwt.sign(
        { userId: user.username, email: user.email },
        "secret_key",
        {
          expiresIn: "1h",
        }
      );
    } catch (err) {
      console.log(err);
      next(new HttpError("cannot create", 404));
    }
    res
      .status(201)
      .json({ userId: user.username, email: user.email, token: token });
  } catch (err) {
    return new HttpError("could not create user", 500);
  }
};

const getUserList = async (req, res, next) => {
  try {
    const list = await usermodel.find({});
    res.status(200).json(list);
  } catch (err) {
    return next(new HttpError("failed to retrieve list", 404));
  }
};

const login = async (req, res, next) => {
  const password = req.body.password;
  const email = req.body.email;
  let user;
  let gentoken;
  try {
    user = await usermodel.findOne({ email });
    if (user) {
      let isValidPass = false;
      isValidPass = await bcrypt.compare(password, user.password);
      if (!isValidPass) {
        return next(new HttpError("password dosen't match", 404));
      } else {
      }
    } else {
      next(new HttpError("user not found", 404));
    }
    try {
      gentoken = jwt.sign(
        { userId: user.username, email: user.email },
        "secret_key",
        {
          expiresIn: "1h",
        }
      );
      // res.status(200).json({ userId: user.id, email: user.email, user: token });
    } catch (err) {
      console.log(err);
      next(new HttpError("cannot create", 404));
    }
  } catch (err) {
    next(new HttpError("error", 404));
  }
  res
    .status(201)
    .json({ userId: user.username, email: user.email, token: gentoken });
};

exports.getUserList = getUserList;
exports.signup = addUser;
exports.login = login;
