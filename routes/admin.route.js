const express = require("express");
const router = express.Router();
const {
	viewTask,
	deleteTask,
	updateTask,
	createTask,
} = require("../controllers/task.controller");
const {deleteUser} = require("../controllers/admin.controller");
const authenticateUser = require("../middleware/auth.middleware");

//Routes
router.route("/delete/:id").delete(authenticateUser, deleteUser);
router.route("/tasks").get(authenticateUser, viewTask).post(authenticateUser, createTask);
router.route("/tasks/:id").delete(authenticateUser, deleteTask).patch(authenticateUser, updateTask);

module.exports = router;

