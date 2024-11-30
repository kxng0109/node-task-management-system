const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
require('dotenv').config();

//for bcrypt
const hashPassword = password =>{
	const salt = bcrypt.genSaltSync(Number(process.env.BCRYPT_SALT));
	const hash = bcrypt.hashSync(password, salt);
	return hash;
}

const comparePassword = (password, hash) =>{
	const isCorrect = bcrypt.compareSync(password, hash)
	return isCorrect;
}

//for jwt
const generateToken = email => {
	const token = jwt.sign({email}, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRE
	});
	return token;
}

const decodeToken = (token) =>{
	const isCorrect = jwt.verify(token, process.env.JWT_SECRET);
	return isCorrect;
}

module.exports = {
	hashPassword,
	comparePassword,
	generateToken,
	decodeToken
}