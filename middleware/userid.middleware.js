const { getUserDB } = require("../db/user.db");
const {StatusCodes} = require('http-status-codes');

const getUserID = async (req, res, next) => {
	const {email} = req.user;
	const checkUser = await getUserDB(email);
	const userID = checkUser[0];
	if (!userID) {
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({
				success: false,
				message: "No userID",
				error: "This user does not have an ID",
			});
	};
	req.user = { ...req.user, userID };
	next();
};

module.exports = getUserID;
