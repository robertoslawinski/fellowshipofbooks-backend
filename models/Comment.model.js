const { Schema, model } = require("mongoose");

const commentSchema = new Schema({
  text: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  book: { type: Schema.Types.ObjectId, ref: "Book" },
  parentComment: { type: Schema.Types.ObjectId, ref: "Comment", default: null }, // NOVO
  createdAt: { type: Date, default: Date.now }
});

module.exports = model("Comment", commentSchema);
