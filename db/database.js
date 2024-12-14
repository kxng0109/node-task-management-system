const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();

const pool = mysql
	.createPool({
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: "task_management",
		rowsAsArray: true,
	})
	.promise();
	
module.exports = pool;
