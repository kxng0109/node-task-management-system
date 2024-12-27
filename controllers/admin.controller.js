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

	const validateEmail = (email) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		let hasPassedTest = emailRegex.test(email);
		if (hasPassedTest) return validator.isEmail(email);
		return hasPassedTest;
	};

	let hasPassedEmailValidation = validateEmail(email);
	if (!hasPassedEmailValidation) {
		return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
			success: false,
			message: "Invalid email address",
			error: "Invalid email format, ensure the email contains '@' and a valid domain name.",
		});
	}

	let checkUser = await getUserDB(email);
	if (checkUser.length || !checkUser.err) {
		return res.status(StatusCodes.CONFLICT).json({
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

	const result = await registerAdminDB(email, hashPassword(password));
	if (!result || result.err) {
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			success: false,
			message: result.err.sqlMessage || "An error has occured",
			error: "An error has occured",
		});
	}
	let token = generateToken(email);
	res.status(StatusCodes.CREATED).json({
		success: true,
		message: "Admin account created",
		data: { token },
	});
};

const loginAdmin = async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(StatusCodes.BAD_REQUEST).json({
			success: false,
			message: "Email and password required",
			error: "Email and password fields can not be empty",
		});
	}

	let user = await getUserDB(email);
	if (!user || user.err) {
		return res.status(StatusCodes.NOT_FOUND).json({
			success: false,
			message: user.message || "Admin does not exist",
			error: user.err || "Admin with this email doesn't exist",
		});
	}

	let isCorrect = comparePassword(password, user[2]);
	if (!isCorrect) {
		return res.status(StatusCodes.BAD_REQUEST).json({
			success: false,
			message: "Invalid credentials",
			error: "Password or email is incorrect",
		});
	}

	let token = generateToken(email, "admin");

	res.status(StatusCodes.OK).json({
		success: true,
		message: `Login successful. Welcome ${email}`,
		data: token,
	});
};

const deleteUser = async (req, res) => {
	const { userType } = req.user;
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
		if (removeUser.message == "Invalid user") {
			statusCodeType = StatusCodes.NOT_FOUND;
		} else if (removeUser.message == "Permission denied") {
			statusCodeType = StatusCodes.FORBIDDEN;
		} else {
			statusCodeType = StatusCodes.INTERNAL_SERVER_ERROR;
		}

		return res.status(statusCodeType).json({
			success: false,
			message:
				removeUser.message ||
				removeUser.err.message ||
				"An error has occured",
			error: removeUser.err,
		});
	}
	res.status(StatusCodes.NO_CONTENT).json({});
};

module.exports = {
	registerAdmin,
	loginAdmin,
	deleteUser,
};
