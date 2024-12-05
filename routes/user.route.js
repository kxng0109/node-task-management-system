const express = require("express");
const router = express.Router();
const {registerUser, loginUser} = require("../controllers/user.controller");
const { registerAdmin, loginAdmin } = require("../controllers/admin.controller");

//Users
router.route("/register").post(registerUser);
router.route("/login").post( loginUser);

//Admins
router.route("/admin/register").post(registerAdmin);
router.route("/admin/login").post(loginAdmin);

module.exports = router;
