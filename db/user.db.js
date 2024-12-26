const pool = require("./database");
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
	try{
		const [row] = await pool.execute(
			checkAgainst == "id"
				? `SELECT * FROM users WHERE id=?`
				: `SELECT * FROM users WHERE email = ?`,
			[value],
		);
		
		if(row.length){
			return row[0];
		} else{
			return {message: "Invalid user", err: "User not found"}
		}
	} catch(err){
		return {err}
	}
};

const deleteUserDB = async (role, IDToBeRemoved) => {
	if (role != "admin"){
		return { message: "Permission denied", err: "You do not have the permission to perform this task" };
	};
	try{
		const checkUser = await getUserDB(IDToBeRemoved, "id");
		if (checkUser.err) return checkUser;

		await pool.execute(
			`DELETE FROM users
			WHERE id = ?
			`,
			[IDToBeRemoved],
		);
		return "User deleted";	
	}catch(err){
		return {err}
	}
};

module.exports = {
	registerUserDB,
	registerAdminDB,
	getUserDB,
	deleteUserDB,
};
