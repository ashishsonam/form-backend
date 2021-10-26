const express = require("express");
const jwt = require("jsonwebtoken");
const mysql = require("mysql");

const { pool } = require("../helpers/db");

exports.getAllFeedbacks = (req, res) => {
  const sql = "SELECT * FROM FEEDBACK";
  const query = mysql.format(sql);
  pool.query(query, (err, rows) => {
    if (err) {
      return res.status(400).json({
        success: false,
        error: err,
      });
    }
    // console.log(rows);
    let result = [];
    rows.forEach((row) => {
      result = [
        ...result,
        {
          subject_code: row.subject_code,
          Q1: row.Q1,
          Q2: row.Q2,
          Q3: row.Q3,
          Q4: row.Q4,
          Q5: row.Q5,
          Q6: row.Q6,
          Q7: row.Q7,
          Q8: row.Q8,
          Q9: row.Q9,
        },
      ];
    });
    return res.status(200).json({
      success: true,
      msg: result,
    });
  });
};

exports.getFeedbacks = (req, res) => {
  const sql = "SELECT * FROM FEEDBACK WHERE SUBJECT_CODE = ?";
  const query = mysql.format(sql, [req.params.subject_code]);
  pool.query(query, (err, rows) => {
    if (err) {
      return res.status(400).json({
        success: false,
        error: err,
      });
    }
    // console.log(rows);
    let result = [];
    rows.forEach((row) => {
      result = [
        ...result,
        {
          subject_code: row.subject_code,
          Q1: row.Q1,
          Q2: row.Q2,
          Q3: row.Q3,
          Q4: row.Q4,
          Q5: row.Q5,
          Q6: row.Q6,
          Q7: row.Q7,
          Q8: row.Q8,
          Q9: row.Q9,
        },
      ];
    });
    return res.status(200).json({
      success: true,
      msg: result,
    });
  });
};
