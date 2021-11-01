const express = require("express");

const { register, login } = require("../controllers/auth");
const { requireSignin } = require("../middlewares/auth");

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

// router.get("/protected", requireSignin, protected);

module.exports = router;
