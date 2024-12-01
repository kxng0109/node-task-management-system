const express = require("express");
const router = express.Router();
const {
	createTask,
	viewTask,
	updateTask,
	deleteTask,
} = require("../controllers/task.controller");
const authenticateUser = require("../middleware/auth.middleware");
const getUserIDMiddleware = require("../middleware/userid.middleware");

router.route("/").get(authenticateUser, getUserIDMiddleware, viewTask).post(authenticateUser, getUserIDMiddleware, createTask);
router.route("/:id").patch(authenticateUser, getUserIDMiddleware, updateTask).delete(authenticateUser, getUserIDMiddleware, deleteTask);

module.exports = router;
