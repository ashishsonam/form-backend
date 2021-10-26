const express = require("express");

const { postFeedback } = require("../controllers/feedback");
const { requireSignin } = require("../middlewares/auth");

const router = express.Router();

router.post("/postFeedback", requireSignin, postFeedback);

module.exports = router;
