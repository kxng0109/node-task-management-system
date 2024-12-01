const express = require("express");
const router = express.Router();
const {registerUser, loginUser} = require("../controllers/user.controller");
const { registerUserFunction } = require("../middleware/userfunction.middleware");

router.route("/register").post(registerUserFunction, registerUser);
router.route("/login").post( loginUser);

module.exports = router;
