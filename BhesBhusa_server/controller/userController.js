const User = require("../model/userModel");
const nodemailer = require("nodemailer");

// find all the users
const findAll = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (e) {
    res.json(e);
  }
};

//Find user by ID
const findById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the user" });
  }
};

//Delete user by Id
const deleteById = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    res.status(200).json("Data deleted");
  } catch (e) {
    res.json(e);
  }
};

// Update user by ID
const update = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Error updating user:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the user" });
  }
};

module.exports = {
  findAll,
  findById,
  deleteById,
  update,
};
