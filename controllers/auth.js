const express = require("express");
const jwt = require("jsonwebtoken");
const mysql = require("mysql");

const { pool } = require("../helpers/db");
const { hashPassword } = require("../helpers/hashPassword");

exports.register = (req, res) => {
  const { user } = req.body;
  console.log(user);
  let sql = "SELECT * FROM `USER` WHERE `username` = ?";
  let query = mysql.format(sql, user.username);
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
