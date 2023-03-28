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

// get all categories
router.get("/", categoryImageController.getAllCategories);

// get category image with category id
router.get("/:id", categoryImageController.getCategoryById);

// update category with category id
// router.put("/:id", categoryImageController.updateCategory);
//delete image with imageid
router.delete("/:id", categoryImageController.deleteCategory);

module.exports = router;
