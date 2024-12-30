# node-task-management-system

A web application built with **Node.js** that allows users to manage their tasks. Users can create, edit, delete, and mark their tasks as completed. Admins have additional permissions to manage tasks for any user.

## Table of Content
- <a href="#features">Features</a>
- <a href="#technologies-used">Technologies Used</a>
- <a href="#setup">Setup</a>
- <a href="#prerequisites">Prerequisites</a>
- <a href="#installation">Installation</a>
- <a href="#api-endpoints">API Endpoints</a>
- <a href="#license">License</a>


## Features

- **User**:
  - Create tasks
  - Edit tasks
  - Delete tasks
  - Mark tasks as completed
  
- **Admin**:
  - Manage tasks for any user (CRUD operations)
  - View all users and their tasks
  - Delete users

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens) & bcrypt
- **Security**: Helmet, express-rate-limit
- **Input Validation**: Validator

## Setup

To get this project running locally, follow these steps:

### Prerequisites

- Node.js (v14.x or above)
- MySQL

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/kxng0109/node-task-management-app.git
   cd node-task-management-app
   ```
2. **Install dependencies**:
	```bash
	npm install
	```

3. **Set up environment variables**:
	Create a .env file in the root directory of your project and include the following:

	```plaintext
	DB_HOST=database_host
	DB_USER=the_user
	DB_PASSWORD=your_database_password
	JWT_SECRET=your_jwt_secret_key
	JWT_EXPIRE=jwt_expiration_time
	BCRYPT_SALT=bcrypt_salt
	PORT=3000
	```
	Replace the_user, the_password, database_host, and your_jwt_secret_key with your own local values. Also feel free to replace the PORT and BCRYPT_SALT values to any custom value.
	For more information about bcryptjs salt, visit their <a href="https://www.npmjs.com/package/bcryptjs">official docummentation</a>

4. **Run the application**:

	```bash
	npm start
	```
The app will run on http://localhost:3000 by default, unless the "PORT" value is changed.

## API Endpoints
### User Routes
Base URL: ```/api```

| Method   | Endpoint          | Description                          |
|----------|-------------------|--------------------------------------|
| POST     | `/register`       | Register a new user.                |
| POST     | `/login`          | User login.                         |
| POST     | `/admin/register` | Register a new admin.               |
| POST     | `/admin/login`    | Admin login.                        |

Note: email and password are required for login and registration

### Admin Routes
Base URL: ```/api/admin```
| Method   | Endpoint            | Description                               |
|----------|---------------------|-------------------------------------------|
| DELETE   | `/delete/:id`       | Delete a user by their ID.               |
| GET      | `/tasks`            | Get all tasks.                           |
| POST     | `/tasks`            | Create a new task.                       |
| DELETE   | `/tasks/:id`        | Delete a task by its ID.                 |
| PATCH    | `/tasks/:id`        | Update a task by its ID.                 |

### Task Routes (for Users)
Base URL: ```/api/tasks```
| Method   | Endpoint     | Description                               |
|----------|--------------|-------------------------------------------|
| GET      | `/`          | Get all tasks for the authenticated user.|
| POST     | `/`          | Create a new task for the authenticated user.|
| PATCH    | `/:id`       | Update a task by its ID for the authenticated user.|
| DELETE   | `/:id`       | Delete a task by its ID for the authenticated user.|

Note: To create a task, user_id, title, description and deadline are required in that order.
Note: To update a task, "completed" is required.

## License

This project is licensed under the MIT License - see the <a href="/LICENSE">LICENSE</a> file for details.
