const express = require("express");
const jwt = require("jsonwebtoken");
const mysql = require("mysql");

const { pool } = require("../helpers/db");
const { hashPassword } = require("../helpers/hashPassword");

const bcrypt = require("bcrypt");
const saltRounds = 10;

exports.register = (req, res) => {
  console.log(req.body);
  const { user } = req.body;
  let sql =
    "SELECT DISTINCT 1 FROM REGISTRATION_DETAILS WHERE id = ? AND is_verified = true";
  let query = mysql.format(sql, [user.username]);
  pool.query(query, (err, rows) => {
    if (err) {
      return res.status(400).json({
        success: false,
        error: err,
      });
    }
    console.log(rows);
    if (rows.length == 0) {
      return res.status(400).json({
        success: false,
        error: err,
        msg: "you are not yet enrolled",
      });
    }
    sql = "SELECT DISTINCT 1 FROM USER WHERE username = ?";
    query = mysql.format(sql, [user.username]);
    pool.query(query, async (err, rows) => {
      if (err) {
        return res.status(400).json({
          success: false,
          error: err,
        });
      }
      console.log(rows);
      if (rows.length == 1) {
        return res.status(400).json({
          success: false,
          error: err,
          msg: "you are already registered",
        });
      }
      // let token = crypto.randomBytes(32).toString("hex");
      // const hash = await hashPassword(user.password);
      const encryptedPassword = await bcrypt.hash(user.password, saltRounds);
      sql = "INSERT INTO USER VALUES (?, ?)";
      query = mysql.format(sql, [user.username, encryptedPassword]);
      pool.query(query, (err, rows) => {
        if (err) {
          return res.status(400).json({
            success: false,
            error: err,
          });
        }
        const student_details = [
          [user.username, user.year, user.semester, user.section],
        ];
        sql = "INSERT INTO STUDENT VALUES ?";
        query = mysql.format(sql, [student_details]);
        pool.query(query, (err, rows) => {
          if (err) {
            return res.status(400).json({
              success: false,
              error: err,
            });
          }
          const courses = user.courses;
          let courses_taken = [];
          courses.forEach((course) => {
            courses_taken = [...courses_taken, [user.username, course]];
          });
          console.log(courses_taken);
          sql = "INSERT INTO COURSES_TAKEN VALUES ?";
          query = mysql.format(sql, [courses_taken]);
          pool.query(query, (err, rows) => {
            if (err) {
              return res.status(400).json({
                success: false,
                error: err,
              });
            }
            return res.status(200).json({
              success: false,
              msg: "user successfully registered",
            });
          });
        });
      });
    });
  });
};

exports.login = (req, res) => {
  const { user } = req.body;
  let sql = "SELECT * FROM `USER` WHERE `username` = ?";
  let query = mysql.format(sql, [user.username]);
  pool.query(query, async (err, rows) => {
    if (err) {
      return res.status(400).json({
        success: false,
        error: err,
      });
    }
    // console.log(rows);
    if (rows.length) {
      const password_hash = rows[0].password;
      console.log(user.password, password_hash);
      const verified = await bcrypt.compare(user.password, password_hash);
      console.log(verified);
      if (verified) {
        const accessToken = jwt.sign(
          { user: user },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "30000000s",
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
    } else {
      return res.status(400).json({
        success: false,
        msg: "user not found",
      });
    }
  });
};

exports.getCourses = (req, res) => {
  const sql = "SELECT * FROM COURSES";
  const query = mysql.format(sql);
  pool.query(query, (err, rows) => {
    if (err) {
      return res.status(400).json({
        success: false,
        error: err,
      });
    }
    let result = [];
    rows.forEach((row) => {
      result = [...result, { code: row.code, name: row.name }];
    });
    return res.status(200).json({
      success: true,
      msg: result,
    });
  });
};

exports.getCoursesSpecific = (req, res) => {
  const sql =
    "SELECT code, name FROM COURSES JOIN COURSES_TAKEN ON COURSES.code = COURSES_TAKEN.course_code WHERE student_id = ?";
  const query = mysql.format(sql, [req.user.username]);
  pool.query(query, (err, rows) => {
    if (err) {
      return res.status(400).json({
        success: false,
        error: err,
      });
    }
    let result = [];
    rows.forEach((row) => {
      result = [...result, { code: row.code, name: row.name }];
    });
    return res.status(200).json({
      success: true,
      msg: result,
    });
  });
};

exports.getName = (req, res) => {
  console.log(`user = ${req.user}`);
  if (req.user === undefined) {
    return res.status(400).json({
      success: false,
      msg: "Something went wrong",
    });
  }
  if (req.user.username === "admin") {
    return res.status(200).json({
      success: true,
      msg: "admin",
    });
  }
  // console.log(`token expire = ${req.tokenExpire}`);
  let sql = "SELECT * FROM REGISTRATION_DETAILS WHERE `id` = ?";
  let query = mysql.format(sql, [req.user.username]);
  pool.query(query, (err, rows) => {
    if (err) {
      return res.status(400).json({
        success: false,
        error: err,
      });
    }
    let result;
    if (rows.length) {
      result = rows[0].name;
    }
    // rows.forEach((row) => {
    //   result = [
    //     ...result,
    //     {
    //       name: row.name,
    //     },
    //   ];
    // });
    if (result != undefined) {
      return res.status(200).json({
        success: true,
        msg: result,
      });
    } else {
      return res.status(400).json({
        success: false,
        msg: "user not found",
      });
    }
  });
};

exports.getUsername = (req, res) => {
  // const sql = "SELECT * FROM USER WEHRE username = ?";
  // const query = mysql.format(sql, )
  // pool.query(sql, (err, rows) => {
  //   if (err) {
  //     return res.status(400).json({ err });
  //   }
  //   let result = [];
  //   rows.forEach((row) => {
  //     result = [...result, { username: row.username, password: row.password }];
  //   });
  res.status(200).json({
    success: true,
    username: req.user.username,
  });
  // });
};
