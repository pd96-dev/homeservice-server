const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();

const {
  getAllServiceProviders,
  getServiceproviderById,
  createServiceprovider,
  updateServiceprovider,
  deleteServiceprovider,
} = require("../controllers/serviceProvider");

router.get("/", getAllServiceProviders);
router.get("/:id", getServiceproviderById);
router.post("/add", upload.single("file"), createServiceprovider);
router.put("/:id", updateServiceprovider);
router.delete("/:id", deleteServiceprovider);

module.exports = router;
