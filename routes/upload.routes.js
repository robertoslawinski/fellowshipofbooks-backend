const express = require("express");
const multer = require("multer");
const path = require("path");
const { isAuthenticated } = require("../middlewares/jwt.middleware");
const User = require("../models/User.model");

const router = express.Router();

// Configuração do armazenamento com multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

// Rota para upload da foto de perfil
router.post("/avatar", isAuthenticated, upload.single("avatar"), async (req, res) => {
  try {
    const userId = req.payload._id;
    const imageUrl = `http://localhost:5005/uploads/${req.file.filename}`;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar: imageUrl },
      { new: true }
    ).select("-password");

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Error uploading avatar:", err);
    res.status(500).json({ errorMessage: "Upload failed" });
  }
});

module.exports = router;
