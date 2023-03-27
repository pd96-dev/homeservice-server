const express = require("express");
const router = express.Router();
const {
  getAllServiceProviders,
  getServiceproviderById,
  createServiceprovider,
  updateServiceprovider,
  deleteServiceprovider,
} = require("../controllers/serviceProvider");

router.get("/", getAllServiceProviders);
router.get("/:id", getServiceproviderById);
router.post("/add", createServiceprovider);
router.put("/:id", updateServiceprovider);
router.delete("/:id", deleteServiceprovider);

module.exports = router;
