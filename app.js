if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");

const auth = require("./routes/auth");
const feedback = require("./routes/feedback");
const admin = require("./routes/admin");
const admission = require("./routes/admission");

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", auth);
app.use("/api", feedback);
app.use("/api", admin);
app.use("/api", admin);

app.get("/", (req, res) => {
  res.send("Welcome to the Server!!!");
});

app.listen(PORT, () => {
  console.log("Server has started! on http://localhost:" + PORT + "/");
});

// CREATE TABLE `USER` (
//   `username` VARCHAR(10),
//   `password` VARCHAR(50),
//   PRIMARY KEY (`username`)
// );

// CREATE TABLE `STUDENT` (
//   `student_id` VARCHAR(10),
//   `name` VARCHAR(50),
//   `year` INT,
//   `semester` INT,
//   `date_of_feedback` DATE,
//   `branch` VARCHAR(50),
//   `section` CHAR(1),
//   PRIMARY KEY (`student_id`),
//   FOREIGN KEY (`student_id`) REFERENCES `USER`(`username`)
// );

// CREATE TABLE `SUBJECT` (
//   `subject_code` INT,
//   `subject_name` VARCHAR(50),
//   PRIMARY KEY (`subject_code`)
// );

// CREATE TABLE `FEEDBACK` (
//   `student_id` VARCHAR(10),
//   `subject_code` INT,
//   `Q1` INT,
//   `Q2` INT,
//   `Q3` INT,
//   `Q4` INT,
//   `Q5` INT,
//   `Q6` INT,
//   `Q7` INT,
//   `Q8` INT,
//   `Q9` INT,
//   FOREIGN KEY (`student_id`) REFERENCES `STUDENT`(`student_id`),
//   FOREIGN KEY (`subject_code`) REFERENCES `SUBJECT`(`subject_code`)
// );
