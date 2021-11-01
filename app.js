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
app.use("/api/", admin);
app.use("/api", admission);

app.get("/", (req, res) => {
  res.send("Welcome to the Server!!!");
});

app.listen(PORT, () => {
  console.log("Server has started! on http://localhost:" + PORT + "/");
});
