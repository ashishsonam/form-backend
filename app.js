if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");

const auth = require("./routes/auth");
const feedback = require("./routes/feedback");
const admin = require("./routes/admin");
const admission = require("./routes/admission");

const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ limit: "500mb", extended: false }));

app.use(
  cors({
    allowedHeaders: [
      "Content-Type",
      "token",
      "authorization",
      "*",
      "Content-Length",
      "X-Requested-With",
    ],
    origin: "*",
    preflightContinue: true,
  })
);

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
