const express = require("express");
const router = express.Router();
const {
	viewTask,
	deleteTask,
	updateTask,
	createTask,
} = require("../controllers/task.controller");
const {registerAdmin} = require("../controllers/admin.controller");

router.route("/register").post(registerAdmin);
router.route("/tasks").get(viewTask).post(createTask);
router.route("/tasks/:id").delete(deleteTask).patch(updateTask);

module.exports = router;

