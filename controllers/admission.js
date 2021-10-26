const express = require("express");
const jwt = require("jsonwebtoken");
const mysql = require("mysql");

const { pool } = require("../helpers/db");

// exports.postFeedback = (req, res) => {
//   console.log(req.user);
//   const { feedback } = req.body;

//   const student_id = feedback.student_id;
//   const subjects = feedback.subjects;
//   let values = [];
//   subjects.forEach((subject) => {
//     values = [
//       ...values,
//       [
//         student_id,
//         subject.subject_code,
//         subject.q1,
//         subject.q2,
//         subject.q3,
//         subject.q4,
//         subject.q5,
//         subject.q6,
//         subject.q7,
//         subject.q8,
//         subject.q9,
//       ],
//     ];
//   });
//   let sql = "INSERT INTO `FEEDBACK` VALUES ?";
//   let query = mysql.format(sql, [values]);
//   pool.query(query, (err, rows) => {
//     if (err) {
//       return res.status(400).json({
//         success: false,
//         error: err,
//       });
//     }
//     return res.status(200).json({
//       success: true,
//       msg: "Feedback and Student table updated",
//     });
//   });
// };
