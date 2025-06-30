const router = require("express").Router();
const Book = require("../models/Book.model");
const User = require("../models/User.model");
const { isAuthenticated } = require("../middlewares/jwt.middleware");

 
router.post("/add", isAuthenticated, async (req, res) => {
  const { googleId, title, authors, thumbnail } = req.body;

  try {
     
    let book = await Book.findOne({ googleId });
    if (!book) {
      book = await Book.create({ googleId, title, authors, thumbnail });
    }

     
    const updatedUser = await User.findByIdAndUpdate(
      req.payload._id,
      { $addToSet: { favorites: book._id } }, 
      { new: true }
    ).populate("favorites");

    res.status(200).json(updatedUser.favorites);
  } catch (err) {
    res.status(500).json({ errorMessage: "Failed to add book" });
  }
});

 
router.delete("/remove/:googleId", isAuthenticated, async (req, res) => {
  try {
    const book = await Book.findOne({ googleId: req.params.googleId });

    if (!book) return res.status(404).json({ errorMessage: "Book not found" });

    const updatedUser = await User.findByIdAndUpdate(
      req.payload._id,
      { $pull: { favorites: book._id } },
      { new: true }
    ).populate("favorites");

    res.status(200).json(updatedUser.favorites);
  } catch (err) {
    res.status(500).json({ errorMessage: "Failed to remove book" });
  }
});


router.get("/favorites", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.payload._id).populate("favorites");
    res.status(200).json(user.favorites);
  } catch (err) {
    res.status(500).json({ errorMessage: "Failed to get favorites" });
  }
});

module.exports = router;
