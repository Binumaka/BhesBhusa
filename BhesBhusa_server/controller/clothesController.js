const Clothes = require("../model/clothesModel");

// Get all clothes
const findAll = async (req, res) => {
  try {
    const clothes = await Clothes.find();
    res.status(200).json(clothes);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch clothes" });
  }
};

// Save new clothes
const save = async (req, res) => {
  try {
    const {
      title,
      price,
      rating,
      quality,
      category,
      tags,
      description,
      available,
      section,
    } = req.body;

    if (
      !title ||
      !price ||
      !category ||
      !tags ||
      !description ||
      !available ||
      !section
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const image = req.files?.image?.[0]?.filename || null;
    const image1 = req.files?.image1?.[0]?.filename || null;
    const image2 = req.files?.image2?.[0]?.filename || null;

    const clothes = new Clothes({
      category,
      title,
      description,
      price,
      tags,
      section,
      rating,
      quality,
      available,
      image,
      image1,
      image2,
    });

    await clothes.save();
    res.status(201).json(clothes);
  } catch (error) {
    console.error("Error creating clothes:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get clothes by ID
const findById = async (req, res) => {
  try {
    const clothes = await Clothes.findById(req.params.id);
    if (!clothes) return res.status(404).json("Clothes not found");
    res.status(200).json(clothes);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch clothes" });
  }
};

// Delete clothes by ID
const deleteById = async (req, res) => {
  try {
    const clothes = await Clothes.findByIdAndDelete(req.params.id);
    if (!clothes) return res.status(404).json("Clothes not found");
    res.status(200).json("Clothes deleted");
  } catch (e) {
    res.status(500).json({ error: "Failed to delete clothes" });
  }
};

// Update clothes
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const existingClothes = await Clothes.findById(id);
    if (!existingClothes) {
      return res.status(404).json({ message: "Clothes not found" });
    }

    const updatedData = { ...req.body };

    if (req.files) {
      updatedData.image = req.files?.image?.[0]?.filename || existingClothes.image;
      updatedData.image1 = req.files?.image1?.[0]?.filename || existingClothes.image1;
      updatedData.image2 = req.files?.image2?.[0]?.filename || existingClothes.image2;
    }

    const updatedClothes = await Clothes.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    res.status(200).json({ message: "Clothes updated", data: updatedClothes });
  } catch (error) {
    console.error("Error updating clothes:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Search clothes
const searchClothes = async (req, res) => {
  try {
    const { searchTerm } = req.query;
    if (!searchTerm || !searchTerm.trim()) {
      return res.status(400).json({ error: "Search term is required" });
    }

    const regex = new RegExp(searchTerm.trim(), "i");
    const clothes = await Clothes.find({
      $or: [{ title: regex }, { category: regex }],
    });

    res.status(200).json(clothes);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get clothes by section
const getClothesBySection = async (req, res) => {
  try {
    const { section } = req.params;
    const clothes = await Clothes.find({ section });

    if (!clothes || clothes.length === 0) {
      return res
        .status(404)
        .json({ error: "No clothes found for the specified section" });
    }

    res.status(200).json(clothes);
  } catch (error) {
    console.error("Error getting clothes by section:", error);
    res.status(500).json({
      error: "An error occurred while getting clothes by section",
    });
  }
};

// Get clothes by category
const getClothesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const clothes = await Clothes.find({ category });

    if (!clothes || clothes.length === 0) {
      return res
        .status(404)
        .json({ error: "No clothes found for the specified category" });
    }

    res.status(200).json(clothes);
  } catch (error) {
    console.error("Error getting clothes by category:", error);
    res.status(500).json({
      error: "An error occurred while getting clothes by category",
    });
  }
};


module.exports = {
  findAll,
  save,
  findById,
  deleteById,
  update,
  searchClothes,
  getClothesBySection,
  getClothesByCategory,
};
