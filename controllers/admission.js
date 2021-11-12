const { parse } = require("dotenv");
const express = require("express");
const jwt = require("jsonwebtoken");
const mysql = require("mysql");
const multer = require("multer");

const { pool } = require("../helpers/db");
const fs = require("fs");

// var storage = multer.diskStorage({
//   destination: (req, file, callBack) => {
//     callBack(null, "./public/images/"); // './public/images/' directory name where save the file
//   },
//   filename: (req, file, callBack) => {
//     callBack(
//       null,
//       file.fieldname + "-" + Date.now() + path.extname(file.originalname)
//     );
//   },
// });

// var upload = multer({
//   storage: storage,
// });

// exports.fileTest = (req, res) => {
//   upload.single("image");

//   console.log(req.file.filename);
//   let imgsrc = "http://127.0.0.1:5000/images/" + req.file.filename;

//   return res.status(400).json({
//     success: false,
//     msg: imgsrc,
//   });
// };

exports.newAdmission = (req, res) => {
  const { form } = req.body;

  // const

  console.log(form.seat_allotment_letter);

  const registration_details = [
    [
      form.is_verified,
      form.id,
      form.name,
      form.photo,
      form.gender,
      form.blood_group,
      form.dob,
      form.mobile1,
      form.mobile2,
      form.email_id,
      form.aadhar_number,
      form.fathers_name,
      form.fathers_occupation,
      form.mothers_name,
      form.mothers_occupation,
      form.branch,
      form.physically_disabled,
      form.minority_details,
      form.jee_roll_no,
      form.round_of_allotment,
      parseInt(form.air),
      parseFloat(form.percentile),
      parseInt(form.year),
      form.allotment_category,
      form.candidate_category,
      form.seat_allotment_letter,
      form.jee_rank_card,
      form.photo_id_proof,
      form.dob_proof,
      form.income_certificate,
      form.aadhar_card,
      form.caste_certificate,
      form.caste_validity,
      form.obc_ncl_certificate,
      form.disability_certificate,
      form.transfer_certificate,
      form.migration_certificate,
      form.gap_certificate,
    ],
  ];

  const matric = form.education.matric;
  const inter = form.education.inter;

  const education_details = [
    [
      form.jee_roll_no,
      "matric",
      matric.board_name,
      parseInt(matric.year_of_passing),
      parseInt(matric.marks_obtained),
      parseFloat(matric.percentage),
    ],
    [
      form.jee_roll_no,
      "inter",
      inter.board_name,
      parseInt(inter.year_of_passing),
      parseInt(inter.marks_obtained),
      parseFloat(inter.percentage),
    ],
  ];

  const jossa = form.fee_details.at_jossa_counselling;
  const institute = form.fee_details.during_institute_reporting;

  const fee_details = [
    [
      form.jee_roll_no,
      "at_jossa_counselling",
      jossa.dd_ecs_no,
      jossa.date,
      parseInt(jossa.amount),
    ],
    [
      form.jee_roll_no,
      "during_institute_reporting",
      institute.dd_ecs_no,
      institute.date,
      parseInt(institute.amount),
    ],
  ];

  const permanent = form.address.permanent;
  const correspondence = form.address.correspondence;

  const address = [
    [
      form.jee_roll_no,
      "correspondence",
      permanent.street,
      permanent.city,
      permanent.state,
      parseInt(permanent.pincode),
    ],
    [
      form.jee_roll_no,
      "permanent",
      correspondence.street,
      correspondence.city,
      correspondence.state,
      parseInt(correspondence.pincode),
    ],
  ];

  let sql = "INSERT INTO REGISTRATION_DETAILS VALUES ?";
  let query = mysql.format(sql, [registration_details]);

  pool.query(query, (err, rows) => {
    if (err) {
      return res.status(400).json({
        success: false,
        error: err,
      });
    }

    sql = "INSERT INTO EDUCATION VALUES ?";
    query = mysql.format(sql, [education_details]);

    pool.query(query, (err, rows) => {
      if (err) {
        return res.status(400).json({
          success: false,
          error: err,
        });
      }

      sql = "INSERT INTO FEE_DETAILS VALUES ?";
      query = mysql.format(sql, [fee_details]);

      pool.query(query, (err, rows) => {
        if (err) {
          return res.status(400).json({
            success: false,
            error: err,
          });
        }

        sql = "INSERT INTO ADDRESS VALUES ?";
        query = mysql.format(sql, [address]);

        pool.query(query, (err, rows) => {
          if (err) {
            return res.status(400).json({
              success: false,
              error: err,
            });
          }
          return res.status(200).json({
            success: true,
            msg: "registration tables updated",
          });
        });
      });
    });
  });
};
