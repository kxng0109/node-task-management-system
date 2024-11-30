const pool = require("./database");
const { getUserDB } = require("./user.db");

const createTaskDB = async (userID, title, description, deadline) => {
	const [result] = await pool.execute(
		`INSERT INTO tasks(user_id, title, description, deadline)
		VALUES(?, ?, ?, ?)
		`,
		[userID, title, description, deadline],
	);
	return result;
};

const viewTasksDB = async () => {
	const [row] = await pool.execute(`SELECT * FROM tasks`);
	return row;
};

const viewSpecificTaskDB = async (id) => {
	try {
		const [row] = await pool.execute(`SELECT * FROM tasks WHERE id = ?`, [
			id,
		]);
		if (row.length) {
			return row;
		}
		return { err: "Task not found" };
	} catch (err) {
		return err;
	}
};

const checkUserPermission = async(userID, taskID) =>{
	const getTask = await viewSpecificTaskDB(taskID);
	if (getTask.err) {
		return getTask;
	}
	const userIDFromDB = await getTask[0][1];

	const getUser = await getUserDB(userID, "id");
	const userRole = await getUser[0][3];

	if(userIDFromDB != userID && userRole != "admin") {
		return {err: "You do not have permission to modify this task"}
	}
}

const updateTaskDB = async (userID, taskID, completed) => {
	const permission = await checkUserPermission(userID, taskID);
	if(permission.err) return permission;

	try {
		const getTask = await viewSpecificTaskDB(taskID);
		if (getTask.err) {
			return getTask;
		}

		const [row, results] = await pool.execute(
			`
		UPDATE tasks
		SET completed = ?
		WHERE id = ?
		`,
			[completed, taskID],
		);
		return { row, results };
	} catch (err) {
		return err;
	}
};

const deleteTaskDB = async (userID, taskID) => {
	const permission = await checkUserPermission(userID, taskID);
	if(permission.err){
		return permission;
	}

	try {
		const getTask = await viewSpecificTaskDB(id);
		if (getTask.err) {
			return getTask;
		}

		const [result] = await pool.execute(
			`DELETE from tasks 
			WHERE id = ?
			`,
			[id],
		);
		return [result];
	} catch (err) {
		return err;
	}
};

module.exports = {
	createTaskDB,
	viewTasksDB,
	updateTaskDB,
	deleteTaskDB,
};
