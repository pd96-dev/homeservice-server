const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();

const {
  getSearch,
  getAllServiceProvidersCategory,
  getAllServiceProviders,
  getServiceproviderById,
  createServiceprovider,
  updateServiceprovider,
  deleteServiceprovider,
} = require("../controllers/serviceProvider");

router.get("/search/:keyword/:category/:city", getSearch);
router.get("/category/:id", getAllServiceProvidersCategory);
router.get("/", getAllServiceProviders);
router.get("/:id", getServiceproviderById);
router.post("/add", upload.single("file"), createServiceprovider);
router.put("/:id", upload.single("file"), updateServiceprovider);
router.delete("/:id", deleteServiceprovider);

module.exports = router;
