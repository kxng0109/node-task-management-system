const {
	createTaskDB,
	viewTasksDB,
	updateTaskDB,
	deleteTaskDB,
} = require("../db/task.db");
const { StatusCodes } = require("http-status-codes");

const createTask = async (req, res) => {
	const { userID } = req.user;
	const { title, description, deadline } = req.body;

	if (!title || !description || !deadline) {
		return res.status(StatusCodes.BAD_REQUEST).json({
			success: false,
			message: "Fields can not be empty",
			error: "Title, description and deadline are required in order to create a task",
		});
	}

	const task = await createTaskDB(userID, title, description, deadline);
	if (task.err) {
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			success: false,
			message: "An error has occured",
			error: task.err,
		});
	}
	res.status(StatusCodes.CREATED).json({
		success: true,
		data: task,
		message: "Task created",
	});
};

const viewTask = async (req, res) => {
	const task = await viewTasksDB();
	res.status(StatusCodes.OK).json({ msg: task });
};

const updateTask = async (req, res) => {
	const { userID } = req.user;
	const { id: taskID } = req.params;
	const { completed } = req.body;

	if (!taskID) {
		return res.status(StatusCodes.BAD_REQUEST).json({
			success: false,
			message: "Task ID not specified",
			error: "Task ID can not be empty",
		});
	}

	if (!completed && completed != false) {
		return res.status(StatusCodes.BAD_REQUEST).json({
			success: false,
			message: "Fields can not be empty",
			error: "Fields required to update the task can not be empty",
		});
	}
	const task = await updateTaskDB(userID, taskID, completed);
	res.status(StatusCodes.OK).json({
		success: true,
		data: task,
		message: "Task updated",
		success: true,
	});
};

const deleteTask = async (req, res) => {
	const { userID } = req.user;

	const { id: taskID } = req.params;
	const task = await deleteTaskDB(userID, taskID);
	if (task.err) {
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			success: false,
			message: "An error has occured",
			error: task.err,
		});
	}
	res.status(StatusCodes.OK).json({
		success: true,
		data: task,
		message: "Task deleted",
		success: true,
	});
};

module.exports = {
	createTask,
	viewTask,
	updateTask,
	deleteTask,
};
