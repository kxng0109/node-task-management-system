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

router.use(authenticateUser);

//Routes
router.route("/delete/:id").delete(deleteUser);
router.route("/tasks").get(viewTask).post(createTask);
router.route("/tasks/:id").delete(deleteTask).patch(updateTask);

module.exports = router;

