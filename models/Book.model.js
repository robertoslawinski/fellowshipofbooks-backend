const { Schema, model } = require("mongoose");

const bookSchema = new Schema({
  googleId: { type: String, required: true, unique: true },
  title:    String,
  authors:  [String],
  thumbnail: String
});

module.exports = model("Book", bookSchema);
