const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  googleId: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  avatar: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);