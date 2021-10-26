const express = require("express");

const { getAllFeedbacks, getFeedbacks } = require("../controllers/admin");
const { requireSignin } = require("../middlewares/auth");

const router = express.Router();

router.get("/getAllFeedbacks", requireSignin, getAllFeedbacks);

router.get("/getFeedbacks/:subject_code", requireSignin, getFeedbacks);

module.exports = router;
