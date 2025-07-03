const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
  },

  email: {
    type: String,
    unique: true,
  },

  password: {
    type: String,
    require: true,
  },

  image: {
    type: String,
    default: null,
  },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },

  otp: {
    type: String,
  },

  otpExpires: {
    type: Date,
  },

  passwordChangedAt: {
    type: Date,
  },
  
  passwordHistory: {
    type: [String], 
    default: [],
  },

  failedLoginAttempts: {
    type: Number,
    default: 0,
  },

  lockUntil: {
    type: Date,
  },

  resetCode: {
    type: String,
  },

  resetCodeExpires: {
    type: Date,
  },
});

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
