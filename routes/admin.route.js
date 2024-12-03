const express = require("express");
const router = express.Router();
const {
	viewTask,
	deleteTask,
	updateTask,
	createTask,
} = require("../controllers/task.controller");
const {registerAdmin, deleteUser, loginAdmin} = require("../controllers/admin.controller");
const authenticateUser = require("../middleware/auth.middleware");

router.route("/register").post(registerAdmin);
router.route("/delete/:id").delete(authenticateUser, deleteUser);
router.route("/tasks").get(viewTask).post(createTask);
router.route("/tasks/:id").delete(deleteTask).patch(updateTask);
//temp
router.route("/login").post(loginAdmin);

module.exports = router;

