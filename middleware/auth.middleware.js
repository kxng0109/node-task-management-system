const { StatusCodes } = require("http-status-codes");
const { decodeToken } = require("../hashToken");

const authenticateUser = (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return res.status(StatusCodes.UNAUTHORIZED).json({
			success: false,
			message: "Access denied",
			error: "No token found, please login again",
		});
	}

	const token = authHeader.split(" ")[1];

	try {
		const { email, userType } = decodeToken(token);
		req.user = {email, userType};
		next();
	} catch (err) {
		return res.status(StatusCodes.FORBIDDEN).json({
			success: false,
			message: "Invalid token",
			error: "Token is invalid, please login again",
		});
	}
};

module.exports = authenticateUser;
