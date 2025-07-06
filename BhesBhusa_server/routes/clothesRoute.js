const express = require("express");
const {
  findAll,
  save,
  findById,
  deleteById,
  update,
  searchClothes,
  getClothesBySection,
  getClothesByCategory,
} = require("../controller/clothesController");

const router = express.Router();

const multer = require("multer");

//Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "clothes_image");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); 
  }
});

//File filter to validate file types
const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ["image/jpeg", "image/jpg", "image/avif", "image/png"];
    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Only JPEG, PNG, JPG, and AVIF are allowed."), false);
    }
};

//Initialize Multer with storage and file filter
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
});

router.get("/", findAll);
router.post("/", upload.fields([{ name: 'image' }, { name: 'image1' }, { name: 'image2' }]), save);
router.get("/search", searchClothes);
router.get("/:id", findById);
router.delete("/:id", deleteById);
router.put("/:id", upload.fields([{ name: 'image' }, { name: 'image1' }, { name: 'image2' }]),update);
router.get("/section/:section", getClothesBySection);
router.get("/category/:category", getClothesByCategory);

module.exports = router;
