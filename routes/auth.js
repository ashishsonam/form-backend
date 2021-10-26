const express = require("express");

const { test, register, login, protected } = require("../controllers/auth");
const { requireSignin } = require("../middlewares/auth");

const router = express.Router();

router.get("/test", test);

router.post("/register", register);

router.post("/login", login);

router.get("/protected", requireSignin, protected);

module.exports = router;
