const express = require("express");
const jwt = require("jsonwebtoken");
const mysql = require("mysql");

const { pool } = require("../helpers/db");

exports.getApprovalLists = (req, res) => {
  const sql =
    "SELECT name, jee_roll_no FROM REGISTRATION_DETAILS WHERE is_verified = false";
  const query = mysql.format(sql);
  pool.query(query, (err, rows) => {
    if (err) {
      return res.status(400).json({
        success: false,
        error: err,
      });
    }
    let result = [];
    // console.log(rows);

    rows.forEach((row) => {
      // console.log(row);
      result = [...result, { name: row.name, jee_roll_no: row.jee_roll_no }];
    });
    return res.status(200).json({
      success: true,
      msg: result,
    });
  });
};

exports.approve = (req, res) => {
  if (req.user.username != "admin") {
    return res.status(400).json({
      success: false,
      msg: "you are not allowed to access this route",
    });
  }
  console.log("enter1");
  const jee_roll_no = req.params.jee_roll_no;
  const sql =
    'UPDATE REGISTRATION_DETAILS \
    SET\
      is_verified = true,\
      id = (SELECT CONCAT("BT21", (SELECT branch FROM (SELECT * FROM REGISTRATION_DETAILS) AS REGISTRATION_DETAILS_NEW WHERE jee_roll_no = ?), (SELECT RIGHT(1000 + COUNT(*) + 1, 3) FROM (SELECT * FROM REGISTRATION_DETAILS) AS REGISTRATION_DETAILS_NEW WHERE is_verified = true)))\
    WHERE jee_roll_no = ? AND is_verified = false';
  const query = mysql.format(sql, [jee_roll_no, jee_roll_no]);
  pool.query(query, (err, rows) => {
    if (err) {
      return res.status(400).json({
        success: false,
        error: err,
      });
    }
    return res.status(200).json({
      success: true,
      msg: "student's registration approved",
    });
  });
};

exports.getStudentDetails = (req, res) => {
  const jee_roll_no = req.params.jee_roll_no;
  const sql = "SELECT * FROM REGISTRATION_DETAILS WHERE jee_roll_no = ?";
  const query = mysql.format(sql, [jee_roll_no]);
  pool.query(query, (err, rows) => {
    if (err) {
      return res.status(400).json({
        success: false,
        error: err,
      });
    }
    const documents = rows[0];
    return res.status(200).json({
      success: true,
      msg: {
        seat_allotment_letter: documents.seat_allotment_letter,
        jee_rank_card: documents.jee_rank_card,
        photo_id_proof: documents.photo_id_proof,
        dob_proof: documents.dob_proof,
        income_certificate: documents.income_certificate,
        aadhar_card: documents.aadhar_card,
        caste_certificate: documents.caste_certificate,
        caste_validity: documents.caste_validity,
        obc_ncl_certificate: documents.obc_ncl_certificate,
        disability_certificate: documents.disability_certificate,
        transfer_certificate: documents.transfer_certificate,
        migration_certificate: documents.migration_certificate,
        gap_certificate: documents.gap_certificate,
      },
    });
  });
};

exports.addCourse = (req, res) => {
  if (req.user.username != "admin") {
    return res.status(400).json({
      success: false,
      msg: "you are not allowed to access this route",
    });
  }
  const { course } = req.body;
  const sql = "INSERT INTO COURSES VALUES (?, ?)";
  const query = mysql.format(sql, [course.code, course.name]);
  pool.query(query, (err, rows) => {
    if (err) {
      return res.status(400).json({
        success: false,
        error: err,
      });
    }
    return res.status(200).json({
      success: true,
      msg: "course added successfully",
    });
  });
};

exports.addFaculty = (req, res) => {
  if (req.user.username != "admin") {
    return res.status(400).json({
      success: false,
      msg: "you are not allowed to access this route",
    });
  }
  const { faculty } = req.body;
  let sql = "INSERT INTO FACULTY VALUES (?, ?)";
  let query = mysql.format(sql, [faculty.id, faculty.name]);
  pool.query(query, (err, rows) => {
    if (err) {
      return res.status(400).json({
        success: false,
        error: err,
      });
    }
    const faculty_courses = faculty.courses;
    let values = [];
    faculty_courses.forEach((course) => {
      values = [...values, [course, faculty.id]];
    });

    sql = "INSERT INTO TEACHES VALUES ?";
    query = mysql.format(sql, [values]);
    pool.query(query, (err, rows) => {
      if (err) {
        return res.status(400).json({
          success: false,
          error: err,
        });
      }
      return res.status(200).json({
        success: true,
        msg: "facutly added successfully",
      });
    });
  });
};

// exports.getAllFeedbacks = (req, res) => {
//   const sql = "SELECT * FROM FEEDBACK";
//   const query = mysql.format(sql);
//   pool.query(query, (err, rows) => {
// if (err) {
//   return res.status(400).json({
//     success: false,
//     error: err,
//   });
// }
//     // console.log(rows);
//     let result = [];
//     rows.forEach((row) => {
//       result = [
//         ...result,
//         {
//           subject_code: row.subject_code,
//           Q1: row.Q1,
//           Q2: row.Q2,
//           Q3: row.Q3,
//           Q4: row.Q4,
//           Q5: row.Q5,
//           Q6: row.Q6,
//           Q7: row.Q7,
//           Q8: row.Q8,
//           Q9: row.Q9,
//         },
//       ];
//     });
//     return res.status(200).json({
//       success: true,
//       msg: result,
//     });
//   });
// };

exports.getFeedbacks = (req, res) => {
  const sql =
    "SELECT AVG(Q2) as one, AVG(Q3) as two, AVG(Q4) as three, AVG(Q5) as four, AVG(Q6) as five, AVG(Q7) as six, AVG(Q8) as seven FROM FEEDBACK WHERE COURSE_CODE = ?";
  const query = mysql.format(sql, [req.params.course_code]);
  pool.query(query, (err, rows) => {
    if (err) {
      return res.status(400).json({
        success: false,
        error: err,
      });
    }

    console.log(rows);
    const row = rows[0];
    const result = {
      q1: row.one,
      q2: row.two,
      q3: row.three,
      q4: row.four,
      q5: row.five,
      q6: row.six,
      q7: row.three,
    };
    // let result = [];
    // rows.forEach((row) => {
    //   result = [
    //     ...result,
    //     {
    //       Q1: row.Q1,
    //       Q2: row.Q2,
    //       Q3: row.Q3,
    //       Q4: row.Q4,
    //       Q5: row.Q5,
    //       Q6: row.Q6,
    //       Q7: row.Q7,
    //       Q8: row.Q8,
    //       Q9: row.Q9,
    //     },
    //   ];
    // });
    return res.status(200).json({
      success: true,
      msg: result,
      // msg: result,
    });
  });
};

exports.showDocuments = (req, res) => {
  const path = req.body.path;
  res.send(`<img src=${path} />`);
};
