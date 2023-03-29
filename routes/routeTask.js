const express = require("express");
const router = express.Router();
const {
  getAllTasksProperty,
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/task");
router.get("/property/:id", getAllTasksProperty);
router.get("/", getAllTasks);
router.get("/:id", getTaskById);
router.post("/:id", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;