const { registerAdminDB, getUserDB, deleteUserDB } = require("../db/user.db");
const { StatusCodes } = require("http-status-codes");
const {
	comparePassword,
	hashPassword,
	generateToken,
} = require("../hashToken");

const registerAdmin = async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(StatusCodes.BAD_REQUEST).json({
			success: false,
			message: "Email and password requried",
			error: "No email or password was entered",
		});
	}
	let checkUser = await getUserDB(email);
	if (checkUser) {
		return res.status(StatusCodes.BAD_REQUEST).json({
			success: false,
			message: "User exists",
			error: "A user with this email address exists",
		});
	}

	if (password.length < 8) {
		return res.status(StatusCodes.BAD_REQUEST).json({
			success: false,
			message: "Password is too short",
			error: "Password can not be less than 8 characters",
		});
	}

	await registerAdminDB(email, hashPassword(password));
	res.status(StatusCodes.CREATED).json({
		success: true,
		message: "Admin account created",
	});
};

const loginAdmin = async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password)
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ msg: "Email and password required" });

	let user = await getUserDB(email);
	if (!user) {
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ msg: "User with this email doesn't exist" });
	}

	//We can't be comapring passwords like this abegggggggg
	let isCorrect = comparePassword(password, user[2]);
	if (!isCorrect) {
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ msg: "Password is incorrect" });
	}

	//Error dey o!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	let token = generateToken({email, userType: "admin"});
	// console.log(req.headers.authorization)
	res.status(StatusCodes.OK).json({
		success: true,
		message: `Login successful. Welcome ${email}`,
		data: token,
	});
};

const deleteUser = async (req, res) => {
	const { userType } = req.user;
	console.log(userType)
	const { id: IDToBeRemoved } = req.params;
	if (!userType || userType != "admin") {
		return res.status(StatusCodes.FORBIDDEN).json({
			success: false,
			message: "Permission denied",
			error: "User does not have the permission to perform this task",
		});
	}

	if (!IDToBeRemoved) {
		return res.status(StatusCodes.BAD_REQUEST).json({
			success: false,
			message: "No ID specified",
			error: "ID not specified",
		});
	}

	const removeUser = await deleteUserDB(userType, IDToBeRemoved);
	if (removeUser.err) {
		let statusCodeType;
		if (task.message == "Invalid user") {
			statusCodeType = StatusCodes.NOT_FOUND;
		} else if (task.message == "Permission denied") {
			statusCodeType = StatusCodes.FORBIDDEN;
		} else {
			statusCodeType = StatusCodes.INTERNAL_SERVER_ERROR;
		}

		return res.status(statusCodeType).json({
			success: false,
			message: task.message || task.err.message || "An error has occured",
			error: task.err,
		});
	}
	res.status(StatusCodes.NO_CONTENT).json({});
};

module.exports = {
	registerAdmin,
	loginAdmin,
	deleteUser,
};
