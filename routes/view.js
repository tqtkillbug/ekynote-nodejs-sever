const router = require("express").Router();
const viewController = require("../controller/viewController");



router.get("/login",viewController.showLogin);

router.get("/register",viewController.showRegister);

router.get("/",viewController.index);


module.exports = router;