const router = require("express").Router();
const authController = require("../controller/authController");
const passport = require('passport');
const securityController = require('../controller/securityController');



router.post("/register",authController.register);

router.post("/login",authController.login);

router.get("/refreshToken", authController.refreshToken);

router.get("/logout",authController.logout);

router.post("/ping",authController.checkConnect)

router.post("/oauth/extension",securityController.verifyTokenAndGetCurrUser,authController.checkConnect)




module.exports = router;