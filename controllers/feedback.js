const express = require("express");
const jwt = require("jsonwebtoken");
const mysql = require("mysql");

const { pool } = require("../helpers/db");

exports.postFeedback = (req, res) => {
  if (req.user.username == "admin") {
    return res.status(400).json({
      success: false,
      msg: "you are not allowed to access this route",
    });
  }
  console.log(req.body);
  const { feedback } = req.body;

  const student_id = feedback.student_id;
  const courses = feedback.courses;
  let values = [];
  courses.forEach((course) => {
    values = [
      ...values,
      [
        student_id,
        course.course_code,
        course.q1,
        course.q2,
        course.q3,
        course.q4,
        course.q5,
        course.q6,
        course.q7,
        course.q8,
        course.q9,
      ],
    ];
  });
  let sql = "INSERT INTO `FEEDBACK` VALUES ?";
  let query = mysql.format(sql, [values]);
  pool.query(query, (err, rows) => {
    if (err) {
      return res.status(400).json({
        success: false,
        error: err,
      });
    }
    return res.status(200).json({
      success: true,
      msg: "Feedback posted",
    });
  });
};
