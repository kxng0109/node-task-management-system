const { StatusCodes } = require("http-status-codes");
const { decodeToken } = require("../hashToken");

const authenticateUser = (req, res, next) =>{
	const authHeader = req.headers.authorization;
	if(!authHeader || !authHeader.startsWith("Bearer ")){
		return res.status(StatusCodes.UNAUTHORIZED).json({msg: "Access denied"})
	}

	const token = authHeader.split(" ")[1];
	console.log(token);

	try{
		const {email} = decodeToken(token);
		req.user = email;
		next();
	}catch(err){
		return res.status(StatusCodes.FORBIDDEN).json({msg: "Invalid token"})
	}
}

module.exports = authenticateUser;
