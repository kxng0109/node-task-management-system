const pool = require("./database");
const { getUserDB } = require("./user.db");

// [taskID, userID, title, description, deadline, completed, created_at]

const viewTasksDB = async () => {
	const [row] = await pool.execute(`SELECT * FROM tasks`);
	return row;
};

const viewSpecificTaskDB = async (taskID) => {
	try {
		const [row] = await pool.execute(`SELECT * FROM tasks WHERE id = ?`, [
			taskID,
		]);
		if (row.length) {
			return row[0];
		}
		return {message: "Invalid task", err: "Task not found" };
	} catch (err) {
		return { err };
	}
};

const createTaskDB = async (userID, title, description, deadline) => {
	try {
		const [result] = await pool.execute(
			`INSERT INTO tasks(user_id, title, description, deadline)
			VALUES(?, ?, ?, ?)
			`,
			[userID, title, description, deadline],
		);

		const createdTask = await viewSpecificTaskDB(result.insertId);
		return createdTask;
	} catch (err) {
		return { err };
	}
};

//Check whether the user has permission to edit or delete the task
//Admins will always have permission
const checkUserPermission = async (userID, taskID) => {
	//Find out if the task exists
	const getTask = await viewSpecificTaskDB(taskID);
	if (getTask.err) {
		return getTask;
	}

	const userIDFromTaskDB = await getTask[1];
	const getUser = await getUserDB(userID, "id");
	const userRole = await getUser[3];

	if (userIDFromTaskDB != userID && userRole != "admin") {
		return {
			message: "Permission denied",
			err: "You do not have permission to modify this task",
		};
	}
};

const updateTaskDB = async (userID, taskID, completed) => {
	const permission = await checkUserPermission(userID, taskID);
	if (permission && permission.err) return permission;

	try {
		//To find out if that task exists
		const getTask = await viewSpecificTaskDB(taskID);
		if (getTask.err) {
			return getTask;
		}

		await pool.execute(
			`
		UPDATE tasks
		SET completed = ?
		WHERE id = ?
		`,
			[completed, taskID],
		);

		const updatedTask = await viewSpecificTaskDB(taskID);
		return updatedTask;
	} catch (err) {
		return { err };
	}
};

const deleteTaskDB = async (userID, taskID) => {
	const permission = await checkUserPermission(userID, taskID);
	if (permission && permission.err) {
		return permission;
	}

	try {
		const getTask = await viewSpecificTaskDB(taskID);
		if (getTask.err) {
			return getTask;
		}

		await pool.execute(
			`DELETE from tasks 
			WHERE id = ?
			`,
			[taskID],
		);
		return "Task deleted";
	} catch (err) {
		return { err };
	}
};

module.exports = {
	createTaskDB,
	viewTasksDB,
	updateTaskDB,
	deleteTaskDB,
};
