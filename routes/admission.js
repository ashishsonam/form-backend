const express = require("express");
const { newAdmission } = require("../controllers/admission");

const router = express.Router();

router.post("/newAdmission", newAdmission);

module.exports = router;
