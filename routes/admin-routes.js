const express = require("express");
const router = express.Router();
// const path = require("path");
const bodyParser = require("body-parser");
const admin = require("../controllers/adminpage");
const checkAuth = require("../middleware/check-auth");
// router.use("/admin", (req, res, next) => {
//   console.log("get req in admin");
//   res.json({ message: "it works" });
// });

router.use(bodyParser.json());
// router.post("/info", (req, res, next) => {
//   res.send("<div>" + req.body.fname + req.body.lname + "</div>");
// });
// router.use("/admin", admin.adminpage);

router.use(checkAuth);

router.get("/:sub/:id", admin.getqa);

router.get("/:sub", admin.getqalist);

router.post("/:sub", admin.addQuestion);

router.delete("/:sub/:id", admin.deleteqa);

router.get("/today/:sub", admin.getdailyquestion);

router.patch("/:sub", admin.updatedaily);

router.patch("/:sub/:id", admin.updateqabyid);

module.exports = router;
