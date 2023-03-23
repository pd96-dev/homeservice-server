const express = require("express");
const router = express.Router();
const {
  getAllUsers,
//   getUsersPaginated,
//   getUserById,
//   searchUsers,
//   createUser,
//   updateUser,
//   deleteUser,
} = require("../controllers/users");

router.get("/", getAllUsers);
// router.get("/user", getUsersPaginated);
// router.get("/:id", getUserById);
// router.get("/search/:query", searchUsers);
// router.post("/", createUser);
// router.put("/:id", updateUser);
// router.delete("/:id", deleteUser);

module.exports = router;