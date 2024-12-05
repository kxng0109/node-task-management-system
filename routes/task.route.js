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

//Middleware
router.use(authenticateUser);
router.use(getUserIDMiddleware);

//Routes
router.route("/").get(viewTask).post(createTask);
router.route("/:id").patch(updateTask).delete(deleteTask);

module.exports = router;
