const express = require("express");
const router = express.Router();
const authorization = require("../middleware/authorization");
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/users");

router.get("/", getAllUsers);
router.get("/:id" , getUserById);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;