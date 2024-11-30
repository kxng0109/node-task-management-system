const express = require("express");
const router = express.Router();
const {
	createTask,
	viewTask,
	updateTask,
	deleteTask,
} = require("../controllers/task.controller");
const authenticateUser = require("../middleware/auth.middleware");

router.route("/").get(authenticateUser, viewTask).post(authenticateUser, createTask);
router.route("/:id").patch(authenticateUser, updateTask).delete(authenticateUser, deleteTask);

module.exports = router;
