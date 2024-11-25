const pool = require("./database");

const registerUser = async (email, password) => {
	const [row, result] = await pool.execute(
		"INSERT INTO users(email, password) VALUES(?, ?)",
		[email, password],
	);
	return result;
};

const getUser = async(id) =>{
	const [row, result] = await pool.execute(
		`SELECT * FROM users
		WHERE id=?
		`,
		[id]
		);
	if(!row.length){
		return {err: "User does not exist"}
	}
	return [row, result]
}


const deleteUser = async(role, id) =>{
	if(role != 'admin') return {err: "You don't have the permission to perform this task"}
	const checkUser = await getUser(id);
	if(checkUser.err) return {err: checkUser.err};

	const [row, result] = await pool.execute(
		`DELETE FROM users
		WHERE id = ?
		`, 
		[id]
	);
	return {row, result}
}


module.exports = {
	registerUser,
	deleteUser
}