const express = require("express");
const { registerUser, loginUser, logoutUser, forgetPassword } = require("../controllers/userController");
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/password/forget").post(forgetPassword)
router.route("/logout").get(logoutUser);

module.exports = router;