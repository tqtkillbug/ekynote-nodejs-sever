const router = require("express").Router();
const authController = require("../controller/authController");


router.post("/register",authController.register);

router.post("/login",authController.login);

router.get("/refreshToken", authController.refreshToken);

router.get("/logout",authController.logout);

router.post("/ping",authController.checkConnect)


module.exports = router;