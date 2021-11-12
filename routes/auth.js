const express = require("express");

const {
  register,
  login,
  getCourses,
  getCoursesSpecific,
  getName,
  getUsername,
} = require("../controllers/auth");
const { requireSignin } = require("../middlewares/auth");

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/getCourses", getCourses);
router.get("/getName", requireSignin, getName);
router.get("/getUsername", requireSignin, getUsername);
router.get("/getCoursesSpecific", requireSignin, getCoursesSpecific);

// router.get("/protected", requireSignin, protected);

module.exports = router;
