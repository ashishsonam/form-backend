const express = require("express");

const {
  getAllFeedbacks,
  getFeedbacks,
  approve,
  addCourse,
  addFaculty,
  getApprovalLists,
  getStudentDetails,
  showDocuments,
} = require("../controllers/admin");
const { requireSignin } = require("../middlewares/auth");

const router = express.Router();

router.get("/approve/:jee_roll_no", requireSignin, approve);

router.post("/addCourse", requireSignin, addCourse);

router.post("/addFaculty", requireSignin, addFaculty);

router.get("/getApprovalLists", getApprovalLists);

router.get("/getStudentDetails/:jee_roll_no", getStudentDetails);
router.get("/showDocuments", showDocuments);

// router.get("/getAllFeedbacks", requireSignin, getAllFeedbacks);

router.get("/getFeedbacks/:course_code", requireSignin, getFeedbacks);

module.exports = router;
