const express = require("express");
const jwt = require("jsonwebtoken");
const mysql = require("mysql");

const { pool } = require("../helpers/db");
const { hashPassword } = require("../helpers/hashPassword");

exports.register = (req, res) => {
  const { user } = req.body;
  console.log(user);
  let sql = "SELECT * FROM `USER` WHERE `username` = ?";
  let query = mysql.format(sql, [user.username]);
  pool.query(query, async (err, rows) => {
    if (err) {
      return res.status(400).json({
        success: false,
        error: err,
      });
    }
    let result = [];
    rows.forEach((row) => {
      result = [...result, { username: row.username, password: row.password }];
    });
    if (result.length) {
      return res.status(400).json({
        success: false,
        error: err,
        msg: "User with that id already exists",
      });
    }
    // let token = crypto.randomBytes(32).toString("hex");
    // const hash = await hashPassword(user.password);
    sql = "INSERT INTO `USER` VALUES (?, ?)";
    query = mysql.format(sql, [user.username, user.password]);
    pool.query(query, (err, rows) => {
      if (err) {
        return res.status(400).json({
          success: false,
          error: err,
          msg: "Failed to register user",
        });
      }
      return res.status(200).json({
        success: true,
        msg: "User successfully registered",
      });
    });
  });
};

exports.login = (req, res) => {
  const { user } = req.body;
  let sql = "SELECT * FROM `USER` WHERE `username` = ? AND `password` = ?";
  let query = mysql.format(sql, [user.username, user.password]);
  pool.query(query, (err, rows) => {
    if (err) {
      return res.status(400).json({
        success: false,
        error: err,
      });
    }
    let result = [];
    rows.forEach((row) => {
      result = [...result, { username: row.username, password: row.password }];
    });
    if (result.length) {
      const accessToken = jwt.sign(
        { user: user },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "3000s",
        }
      );
      const refreshToken = jwt.sign(
        { user: user },
        process.env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: "1y",
        }
      );
      return res.status(200).json({
        success: true,
        msg: "User logged in",
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
    } else {
      return res.status(400).json({
        success: false,
        msg: "Authentication failed, wrong user id or password",
      });
    }
  });
};

exports.protected = (req, res) => {
  console.log(`user = ${req.user}`);
  // if (req.user == null) {
  //   return res.status(400).json({
  //     success: false,
  //     msg: "Something went wrong",
  //   });
  // }
  console.log(`token expire = ${req.tokenExpire}`);
  let sql = "SELECT * FROM STUDENT WHERE `student_id` = ?";
  let query = mysql.format(sql, [req.user.username]);
  pool.query(query, (err, rows) => {
    if (err) {
      return res.status(400).json({
        success: false,
        error: err,
      });
    }
    let result = [];
    rows.forEach((row) => {
      result = [
        ...result,
        {
          student_id: row.student_id,
          name: row.name,
          year: row.year,
          semester: row.semester,
          date_of_feedback: row.date_of_feedback,
          branch: row.branch,
          section: row.section,
        },
      ];
    });
    console.log(result.length);
    if (result.length) {
      res.status(200).json(result);
    } else {
      return res.status(400).json({
        success: false,
        msg: "user not found",
      });
    }
  });
};

exports.test = (req, res) => {
  const sql = "SELECT * FROM USER";
  pool.query(sql, (err, rows) => {
    if (err) {
      return res.status(400).json({ err });
    }
    let result = [];
    rows.forEach((row) => {
      result = [...result, { username: row.username, password: row.password }];
    });

    res.status(200).json(result);
  });
};
