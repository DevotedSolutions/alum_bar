const jwt = require("jsonwebtoken");

const JWT_SECRET = "abdul&desby";

exports.authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET); // Ensure to set JWT_SECRET in environment variables
    req.user = decoded; // Save decoded user data in request
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token." });
  }
};
