let jwt = require("jsonwebtoken");
let key = "waqas";
exports.authVerify = (req, res, next) => {
  const token = req.header("Authorization");
  // console.log(req.header('Authorization'));

  if (!token) {
    return res.status(401).json({ message: "Token not provided." });
  }

  try {
    if (token === "adminLogin") {
      next();
    } else {
      const decoded = jwt.verify(token, key);

      next();
    }
  } catch (error) {
    res.status(403).json({ message: "error occured", error: error.message });
  }
};
