const express = require("express");
const {findAll,findById,deleteById, update} = require("../controller/userController");

const router= express.Router();

router.get("/",findAll);
router.get("/:id", findById);
router.delete("/:id", deleteById);
router.put("/:id", update);

module.exports= router;