CREATE TABLE `REGISTRATION_DETAILS` (
  `is_verified` BOOLEAN,
  `id` VARCHAR(10),
  `name` VARCHAR(50),
  `photo` VARCHAR(50),
  `gender` CHAR(1) CHECK (`gender` IN ('M', 'F', 'T')),
  `blood_group` CHAR(3),
  `dob` DATE,
  `mobile1` VARCHAR(10),
  `mobile2` VARCHAR(10),
  `email_id` VARCHAR(50),
  `aadhar_number` VARCHAR(20),
  `fathers_name` VARCHAR(50),
  `fathers_occupation` VARCHAR(50),
  `mothers_name` VARCHAR(50),
  `mothers_occupation` VARCHAR(50),
  `branch` VARCHAR(20) CHECK (`branch` IN ('CSE', 'ECE')),
  `physically_disabled` CHAR(3) CHECK (`physically_disabled` IN ('YES', 'NO')),
  `minority_details` VARCHAR(20) CHECK (`minority_details` IN ('Muslim', 'Jain', 'Sikh', 'Christain', 'NA')),
  `jee_roll_no` VARCHAR(20),
  `round_of_allotment` INT CHECK (`round_of_allotment` IN (1, 2, 3, 4, 5, 6, 7)),
  `AIR` INT,
  `percentile` DECIMAL(10, 3),
  `year` INT,
  `allotment_category` VARCHAR(10) CHECK (`allotment_category` IN ('GEN', 'GEN-EWS', 'OBC', 'SC/ST')),
  `candidate_category` VARCHAR(10) CHECK (`candidate_category` IN ('GEN', 'GEN-EWS', 'OBC', 'SC/ST')),
  `seat_allotment_letter` VARCHAR(50),
  `jee_rank_card` VARCHAR(50),
  `photo_id_proof` VARCHAR(50),
  `dob_proof` VARCHAR(50),
  `income_certificate` VARCHAR(50),
  `aadhar_card` VARCHAR(50),
  `caste_certificate` VARCHAR(50),
  `caste_validity` VARCHAR(50),
  `obc_ncl_certificate` VARCHAR(50),
  `disability_certificate` VARCHAR(50),
  `transfer_certificate` VARCHAR(50),
  `migration_certificate` VARCHAR(50),
  `gap_certificate` VARCHAR(50),
  PRIMARY KEY (`jee_roll_no`)
);

CREATE TABLE `EDUCATION` (
  `jee_roll_no` VARCHAR(20),
  `class` VARCHAR(8) CHECK (`class` IN ('matric', 'inter')),
  `board_name` VARCHAR(50),
  `year_of_passing` INT,
  `marks_obtained` INT,
  `percentage` INT,
  PRIMARY KEY (`jee_roll_no`, `class`),
  FOREIGN KEY (`jee_roll_no`) REFERENCES `REGISTRATION_DETAILS`(`jee_roll_no`)
);

CREATE TABLE `FEE_DETAILS` (
  `jee_roll_no` VARCHAR(20),
  `fee_type` VARCHAR(50) CHECK (`fee_type` IN ('at_jossa_counselling', 'during_institute_reporting')),
  `dd_ecs_no` VARCHAR(50),
  `date` DATE,
  `amount` INT,
  PRIMARY KEY (`jee_roll_no`, `fee_type`),
  FOREIGN KEY (`jee_roll_no`) REFERENCES `REGISTRATION_DETAILS`(`jee_roll_no`)
);

CREATE TABLE `ADDRESS` (
  `jee_roll_no` VARCHAR(20),
  `address_type` VARCHAR(20) CHECK (`address_type` IN ('Permanent', 'Correspondence')),
  `street` VARCHAR(50),
  `city` VARCHAR(20),
  `state` VARCHAR(20),
  `pincode` INT,
  PRIMARY KEY (`jee_roll_no`, `address_type`),
  FOREIGN KEY (`jee_roll_no`) REFERENCES `REGISTRATION_DETAILS`(`jee_roll_no`)
);

CREATE TABLE `USER` (
  `username` VARCHAR(10),
  `password` VARCHAR(50),
  PRIMARY KEY (`username`), 
);

CREATE TABLE `STUDENT` (
  `id` VARCHAR(10),
  `year` INT,
  `semester` INT,
  `date_of_feedback` DATE,
  `section` CHAR(1),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`id`) REFERENCES `USER`(`username`)
);

CREATE TABLE `COURSES` (
  `code` INT,
  `name` VARCHAR(50),
  PRIMARY KEY (`code`)
);

CREATE TABLE `COURSES_TAKEN` (
  `student_id` VARCHAR(50),
  `course_code` INT,
  PRIMARY KEY (`student_id`, `course_code`),
  FOREIGN KEY (`student_id`) REFERENCES `STUDENT`(`id`),
  FOREIGN KEY (`course_code`) REFERENCES `COURSES`(`code`)
);

CREATE TABLE `FACULTY` (
  `id` INT,
  `name` VARCHAR(50),
  PRIMARY KEY (`id`)
);

CREATE TABLE `COURSES_TAUGHT` (
  `course_code` INT,
  `faculty_id` INT,
  PRIMARY KEY (`course_code`, `faculty_id`),
  FOREIGN KEY (`course_code`) REFERENCES `COURSES`(`code`)
  FOREIGN KEY (`faculty_id`) REFERENCES `FACULTY`(`id`),
);

CREATE TABLE `FEEDBACK` (
  `student_id` VARCHAR(10),
  `course_code` INT,
  `Q1` INT CHECK (`Q1` IN (1, 2, 3, 4, 5)),
  `Q2` INT CHECK (`Q2` IN (1, 2, 3, 4, 5)),
  `Q3` INT CHECK (`Q3` IN (1, 2, 3, 4, 5)),
  `Q4` INT CHECK (`Q4` IN (1, 2, 3, 4, 5)),
  `Q5` INT CHECK (`Q5` IN (1, 2, 3, 4, 5)),
  `Q6` INT CHECK (`Q6` IN (1, 2, 3, 4, 5)),
  `Q7` INT CHECK (`Q7` IN (1, 2, 3, 4, 5)),
  `Q8` INT CHECK (`Q8` IN (1, 2, 3, 4, 5)),
  `Q9` VARCHAR(100),
  PRIMARY KEY (`student_id`, `course_code`),
  FOREIGN KEY (`student_id`) REFERENCES `STUDENT`(`id`),
  FOREIGN KEY (`course_code`) REFERENCES `COURSES`(`code`)
);

UPDATE REGISTRATION_DETAILS 
SET
  is_verified = true,
  id = (SELECT CONCAT("BT21", (SELECT branch FROM (SELECT * FROM REGISTRATION_DETAILS) AS REGISTRATION_DETAILS_NEW WHERE jee_roll_no = "122323423"), (SELECT RIGHT(1000 + COUNT(*) + 1, 3) FROM (SELECT * FROM REGISTRATION_DETAILS) AS REGISTRATION_DETAILS_NEW WHERE is_verified = true)))
WHERE jee_roll_no = "122323423" AND is_verified = false;

