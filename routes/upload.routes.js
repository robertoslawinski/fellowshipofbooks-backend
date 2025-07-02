const express = require("express");
const multer = require("multer");
const { isAuthenticated } = require("../middlewares/jwt.middleware");
const User = require("../models/User.model");
const { storage } = require("../config/cloudinary"); // Cloudinary storage

const router = express.Router();

const upload = multer({ storage });

//   Cloudinary
router.post("/avatar", isAuthenticated, upload.single("avatar"), async (req, res) => {
  try {
    const userId = req.payload._id;
    const imageUrl = req.file.path;  

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
