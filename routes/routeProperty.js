const express = require("express");
const router = express.Router();
const {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
} = require("../controllers/properties");

router.get("/user/:id", getAllProperties);
router.get("/:id", getPropertyById);
router.post("/:id", createProperty);
router.put("/:id", updateProperty);
router.delete("/:id", deleteProperty);

module.exports = router;