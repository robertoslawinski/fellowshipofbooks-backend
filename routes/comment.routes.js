const router = require("express").Router();
const Comment = require("../models/Comment.model");
const { isAuthenticated } = require("../middlewares/jwt.middleware");

router.post("/:bookId", isAuthenticated, async (req, res) => {
  const { text, parentComment } = req.body;
  const userId = req.payload._id;
  const { bookId } = req.params;

  try {
    const comment = await Comment.create({ text, user: userId, book: bookId, parentComment });
    const populated = await comment.populate("user", "username avatar");
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ errorMessage: "Failed to post comment" });
  }
});

// NOVA ROTA PARA COMENTÁRIOS EM ÁRVORE
router.get("/thread/:bookId", async (req, res) => {
  try {
    const comments = await Comment.find({ book: req.params.bookId })
      .populate("user", "username avatar")
      .sort({ createdAt: 1 });

    const commentMap = {};
    comments.forEach((c) => (commentMap[c._id] = { ...c._doc, replies: [] }));
    const rootComments = [];

    comments.forEach((c) => {
      if (c.parentComment) {
        commentMap[c.parentComment]?.replies.push(commentMap[c._id]);
      } else {
        rootComments.push(commentMap[c._id]);
      }
    });

    res.status(200).json(rootComments);
  } catch (err) {
    res.status(500).json({ errorMessage: "Failed to load threaded comments" });
  }
});

router.get("/:bookId", async (req, res) => {
  try {
    const comments = await Comment.find({ book: req.params.bookId })
      .populate("user", "username avatar")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ errorMessage: "Failed to load comments" });
  }
});

router.put("/:commentId", isAuthenticated, async (req, res) => {
  const { text } = req.body;

  try {
    const comment = await Comment.findOneAndUpdate(
      { _id: req.params.commentId, user: req.payload._id },
      { text },
      { new: true }
    );

    if (!comment) return res.status(403).json({ errorMessage: "Not allowed" });

    res.status(200).json(comment);
  } catch (err) {
    res.status(500).json({ errorMessage: "Failed to update comment" });
  }
});

router.delete("/:commentId", isAuthenticated, async (req, res) => {
  try {
    const deleted = await Comment.findOneAndDelete({
      _id: req.params.commentId,
      user: req.payload._id,
    });

    if (!deleted) return res.status(403).json({ errorMessage: "Not allowed" });

    res.status(200).json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ errorMessage: "Failed to delete comment" });
  }
});

router.get("/user/:userId", async (req, res) => {
  try {
    const userComments = await Comment.find({ user: req.params.userId });
    res.status(200).json(userComments);
  } catch (err) {
    res.status(500).json({ errorMessage: "Failed to load comments" });
  }
});

module.exports = router;
