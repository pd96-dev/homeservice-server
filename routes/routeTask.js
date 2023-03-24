const express = require("express");
const router = express.Router();
const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/task");

router.get("/property/:id", getAllTasks);
router.get("/:id", getTaskById);
router.post("/:id", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;