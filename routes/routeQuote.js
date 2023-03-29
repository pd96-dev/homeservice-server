const express = require("express");
const router = express.Router();
const {
  getAllQuotes,
  getQuoteById,
  createQuote,
  updateQuote,
  deleteQuote,
} = require("../controllers/quotes");

router.get("/serviceprovider/:id", getAllQuotes);
router.get("/:id", getQuoteById);
router.post("/", createQuote);
router.put("/:id", updateQuote);
router.delete("/:id", deleteQuote);

module.exports = router;
