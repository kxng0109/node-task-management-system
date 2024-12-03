const { registerUserDB, getUserDB } = require("../db/user.db");
const { StatusCodes } = require("http-status-codes");
const validator = require("validator");
const {
	comparePassword,
	hashPassword,
	generateToken,
} = require("../hashToken");

const registerUser = async (req, res) => {
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
	if (checkUser) {
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

	await registerUserDB(email, hashPassword(password));
	let token = generateToken(email);
	res.status(StatusCodes.CREATED).json({
		success: true,
		message: "User account created",
		data: { token },
	});
};

const loginUser = async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(StatusCodes.BAD_REQUEST).json({
			success: false,
			message: "Email and password required",
			error: "Email and password fields can not be empty",
		});
	}

	let user = await getUserDB(email);
	if (!user) {
		return res.status(StatusCodes.NOT_FOUND).json({
			success: false,
			message: "User does not exist",
			error: "User with this email doesn't exist",
		});
	}

	//We can't be comapring passwords like this abegggggggg
	let isCorrect = comparePassword(password, user[2]);
	if (!isCorrect) {
		return res.status(StatusCodes.BAD_REQUEST).json({
			success: false,
			message: "Invalid credentials",
			error: "Password or email is incorrect",
		});
	}

	//Error dey o!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	let token = generateToken(email);
	// console.log(req.headers.authorization)
	res.status(StatusCodes.OK).json({
		success: true,
		message: `Login successful. Welcome ${email}`,
		data: { token },
	});
};

module.exports = {
	registerUser,
	loginUser,
};
