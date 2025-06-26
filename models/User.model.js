const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favorites: [{ type: Schema.Types.ObjectId, ref: "Book" }],
  avatar: { type: String, default: "" }
});

module.exports = model("User", userSchema);
