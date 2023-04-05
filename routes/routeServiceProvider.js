const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();

const {
  getAllServiceProvidersCategory,
  getAllServiceProviders,
  getServiceproviderById,
  createServiceprovider,
  updateServiceprovider,
  deleteServiceprovider,
} = require("../controllers/serviceProvider");

router.get("/category/:id", getAllServiceProvidersCategory);
router.get("/", getAllServiceProviders);
router.get("/:id", getServiceproviderById);
router.post("/add", upload.single("file"), createServiceprovider);
router.put("/:id", upload.single("file"), updateServiceprovider);
router.delete("/:id", deleteServiceprovider);

module.exports = router;
