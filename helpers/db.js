const mysql = require("mysql");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "dbms_mini_project",
});

exports.pool = pool;
