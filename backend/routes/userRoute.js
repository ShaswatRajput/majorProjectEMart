const express = require("express");
const { registerUser,
    loginUser,
    logoutUser,
    forgetPassword,
    resetPassword,
    getUserDetails,
    updatePassword,
    updateProfile } = require("../controllers/userController");
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth")


router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/password/forget").post(forgetPassword);

router.route("/password/reset/:token").put(resetPassword);

router.route("/logout").get(logoutUser);

router.route("/me").get(isAuthenticatedUser, getUserDetails)

router.route("/password/update").put(isAuthenticatedUser, updatePassword)

router.route("/me/update").put(isAuthenticatedUser, updateProfile)
module.exports = router;