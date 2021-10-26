const jwt = require("jsonwebtoken");

exports.requireSignin = (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, data) => {
      if (data) {
        req.user = data.user;
      } else if (err.message === "jwt expired") {
        return res.status(400).json({
          success: false,
          msg: "Access token expired",
        });
      }
    });
  } else {
    return res.status(400).json({ error: "Authorization required" });
  }
  next();
};
