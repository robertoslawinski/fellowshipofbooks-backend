const jwt = require("jsonwebtoken");

function isAuthenticated(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ errorMessage: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.TOKEN_SECRET);
    req.payload = payload; // armazenamos o ID e username/email
    next();
  } catch (error) {
    return res.status(401).json({ errorMessage: "Invalid token" });
  }
}

module.exports = { isAuthenticated };
