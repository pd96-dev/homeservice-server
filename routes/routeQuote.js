const express = require("express");
const router = express.Router();
const {
  getAllQuotesTaskId,
  getAllQuotes,
  getQuoteById,
  createQuote,
  updateQuote,
  approveQuote,
  deleteQuote,
} = require("../controllers/quotes");

router.get("/task/:id", getAllQuotesTaskId);
router.get("/serviceprovider/:id", getAllQuotes);
router.get("/:id", getQuoteById);
router.post("/", createQuote);
router.put("/:id", updateQuote);
router.put("/approve/:id", approveQuote);
router.delete("/:id", deleteQuote);

module.exports = router;
