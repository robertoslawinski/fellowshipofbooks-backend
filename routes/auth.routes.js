const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const { isAuthenticated } = require("../middlewares/jwt.middleware");

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ errorMessage: "All fields are required" });
  }

  try {
    const salt = bcrypt.genSaltSync(12);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User created", userId: newUser._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errorMessage: "Error creating user" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      return res.status(400).json({ errorMessage: "Email not found" });
    }

    const passwordMatch = bcrypt.compareSync(password, foundUser.password);
    if (!passwordMatch) {
      return res.status(403).json({ errorMessage: "Incorrect password" });
    }

    const payload = {
      _id: foundUser._id,
      username: foundUser.username,
      email: foundUser.email,
    };

    const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: "6h",
    });

    res.status(200).json({ authToken });
  } catch (err) {
    console.error("🔥 LOGIN ERROR:", err);
    res.status(500).json({ errorMessage: "Login error", details: err.message });
  }
});

router.get("/verify", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.payload._id).select("-password");
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ errorMessage: "Failed to verify user" });
  }
});

module.exports = router;
