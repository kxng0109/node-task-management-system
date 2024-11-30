const {
	createTaskDB,
	viewTasksDB,
	updateTaskDB,
	deleteTaskDB,
} = require("../db/task.db");
const { StatusCodes } = require("http-status-codes");
const { getUserDB } = require("../db/user.db");

const createTask = async (req, res) => {
	const email = req.user;
	const checkUser = await getUserDB(email);
	const userID = checkUser[0];
	const { title, description, deadline } = req.body;

	if(!userID) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: "This user does not have an ID"})
	if (!title || !description || !deadline) {
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ msg: "Enter the required fields" });
	}

	const task = await createTaskDB(userID, title, description, deadline);
	if (task.err){
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: task.err });
	}
	res.status(StatusCodes.CREATED).json({ msg: task });
};

const viewTask = async (req, res) => {
	const task = await viewTasksDB();
	res.status(StatusCodes.OK).json({ msg: task });
};

const updateTask = async (req, res) => {
	const email = req.user;
	const checkUser = await getUserDB(email);
	const userID = checkUser[0];

	const { id: taskID } = req.params;
	const { completed } = req.body;
	if (!taskID) {
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ msg: "Specify the ID of the task" });
	}
	if (!completed && completed != false) {
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({
				msg: "You can not leave required fields empty",
				success: false,
			});
	}
	const task = await updateTaskDB(userID, taskID, completed);
	res.status(StatusCodes.OK).json({ msg: task, success: true });
};

const deleteTask = async (req, res) => {
	const email = req.user;
	const checkUser = await getUserDB(email);
	const userID = checkUser[0];

	const { id: taskID } = req.params;
	const task = await deleteTaskDB(userID, taskID);
	if (task.err) {
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ msg: task.err, success: false });
	}
	res.status(StatusCodes.OK).json({ msg: "Task deleted", success: true });
};

module.exports = {
	createTask,
	viewTask,
	updateTask,
	deleteTask,
};
