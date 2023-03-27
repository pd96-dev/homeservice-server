const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const propertyImageController = require("../controllers/propertyImageController");

// Upload an image
router.post(
  "/upload-image",
  upload.single("file"),
  propertyImageController.uploadPropertyImage
);
router.get("/");
// get all property images
router.get("/property/:id", propertyImageController.getAllPropertyImages);
// get image with imageid
router.get("/:id", propertyImageController.getPropertyImageById);
// update image with imageid
// router.put("/:id", propertyImageController.);
//delete image with imageid
router.delete("/:id", propertyImageController.deletePropertyImageById);

module.exports = router;
