const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const categoryImageController = require("../controllers/category");

// Upload an image
router.post(
  "/upload-image",
  upload.single("file"),
  categoryImageController.uploadCategoryImage
);
router.get("/");
// get all property images
router.get("/property/:id", categoryImageController.getAllCategories);

// get image with imageid
router.get("/:id", categoryImageController.getCategoryById);
// update image with imageid
// router.put("/:id", propertyImageController.);
//delete image with imageid
router.delete("/:id", categoryImageController.updateCategory);

module.exports = router;
