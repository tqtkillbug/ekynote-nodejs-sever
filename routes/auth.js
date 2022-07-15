const router = require("express").Router();
const authController = require("../controller/authController");
const passport = require('passport');



router.post("/register",authController.register);

router.post("/login",authController.login);

router.post("/refreshToken", authController.refreshToken);

router.get("/logout",authController.logout);



module.exports = router;