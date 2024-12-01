const pool = require("./database");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const registerUserDB = async (email, password) => {
	try{
		const [result] = await pool.execute(
			"INSERT INTO users(email, password) VALUES(?, ?)",
			[email, password],
		);
		return result;
	}catch(err){
		return {err};
	}
};

//Let's try and set up some verification to ensure that any user can't just call this function
const registerAdminDB = async(email, password) =>{
	try{
		const [result] = await pool.execute(
			"INSERT INTO users(email, password, role) VALUES(?, ?, ?)",
			[email, password, "admin"],
		);
		return result;
	}catch(err){
		return {err};
	}
}

const getUserDB = async (value, checkAgainst = "email") => {
	const [row] = await pool.execute(
		checkAgainst == "id"
			? `SELECT * FROM users WHERE id=?`
			: `SELECT * FROM users WHERE email = ?`,
		[value],
	);
	return row[0];
};

const deleteUserDB = async (role, id) => {
	if (role != "admin"){
		return { err: "You don't have the permission to perform this task" };
	};
	const checkUser = await getUserDB(id);
	if (checkUser.err) return { err: checkUser.err };

	const [row, result] = await pool.execute(
		`DELETE FROM users
		WHERE id = ?
		`,
		[id],
	);
	return { row, result };
};

module.exports = {
	registerUserDB,
	registerAdminDB,
	getUserDB,
	deleteUserDB,
};
