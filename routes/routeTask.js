const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
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
router.post("/add", upload.single("file"), createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;
