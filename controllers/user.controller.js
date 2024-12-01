const { registerUserDB, getUserDB } = require("../db/user.db");
const { StatusCodes } = require("http-status-codes");
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
	let checkUser = await getUserDB(email);
	if (checkUser) {
		return res.status(StatusCodes.BAD_REQUEST).json({
			success: false,
			message: "User exists",
			error: "A user with this email address exists",
		});
	}
	
	if(password.length < 8){
		return res.status(StatusCodes.BAD_REQUEST).json({
			success: false,
			message: "Password is too short",
			error: "Password can not be less than 8 characters"
		})
	}

	await registerUserDB(email, hashPassword(password));
	res.status(StatusCodes.CREATED).json({ msg: "User created" });
};

const loginUser = async (req, res) => {
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
	let token = generateToken(email);
	// console.log(req.headers.authorization)
	res.status(StatusCodes.OK).json({ msg: `Welcome ${email}`, token });
};

module.exports = {
	registerUser,
	loginUser,
};
