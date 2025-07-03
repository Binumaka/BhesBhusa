const mongoose = require('mongoose');

const clothSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  quality: {
    type: String,
  },

  category: {
    type: String,
    required: true,
  },

  rating: {
    type: Number, // Changed from String to Number
  },

  tags: {
    type: [String], // Changed to array to allow multiple tags
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  available: {
    type: String,
    required: true,
  },

  section: {
    type: String,
    required: true,
  },

  image: {
    type: String,
    required: true,
  },

  image1: {
    type: String,
  },

  image2: {
    type: String,
  },

  // Optional fields for sizing
  isFreeSize: {
    type: Boolean,
    default: false,
  },

  availableSizes: {
    type: [String],
    default: ["34\"", "36\"", "38\"", "40\"", "42\"", "44\"", "46\""],
  },
});

const ClothModel = mongoose.model("Clothes", clothSchema);
module.exports = ClothModel;
