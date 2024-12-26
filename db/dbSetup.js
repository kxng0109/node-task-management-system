const mysql = require("mysql2");

// Database and table initialization
const initializeDatabase = async () => {
	const connection = mysql
		.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
		})
		.promise();

	const databaseName = "task_management";

	// SQL for creating tables
	const userTableCreationSQL = `
		CREATE TABLE IF NOT EXISTS users (
		    id INT AUTO_INCREMENT PRIMARY KEY,
		    email VARCHAR(255) UNIQUE NOT NULL,
		    password VARCHAR(255) NOT NULL,
		    role VARCHAR(5) NOT NULL DEFAULT 'user',
		    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);
	`;

	const taskTableCreationSQL = `
		CREATE TABLE IF NOT EXISTS tasks (
		    id INT AUTO_INCREMENT PRIMARY KEY,
		    user_id INT NOT NULL,
		    title VARCHAR(255) NOT NULL,
		    description TEXT,
		    deadline DATETIME,
		    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		    completed BOOL DEFAULT 0,
		    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
		);
	`

	try {
		// Create database if it doesn't exist
		await connection.query(`CREATE DATABASE IF NOT EXISTS ${databaseName}`);
		console.log(`Database "${databaseName}" ensured!`);

		// Switch to the new database
		await connection.changeUser({ database: databaseName });
		console.log(`Switched to database "${databaseName}"`);

		// Ensure tables exist
		await connection.query(userTableCreationSQL);
		console.log(`Table "users" ensured!`);
		await connection.query(taskTableCreationSQL);
		console.log(`Table "tasks" ensured!`);
	} catch (err) {
		console.error("Error during database setup:", err.message);
		process.exit(1);
	} finally {
		connection.end();
	}
};

module.exports = initializeDatabase;
