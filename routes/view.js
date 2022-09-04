const router = require("express").Router();
const viewController = require("../controller/viewController");
const securityController = require("../controller/securityController");

const verifyToken = securityController.verifyToken;
const verifyTokenAndInitInfo = securityController.verifyUserAndInitInfo;

router.get("/login",viewController.showLogin);

router.get("/register",viewController.showRegister);

router.get("/",verifyTokenAndInitInfo,viewController.dashboard);

router.get("/list",verifyTokenAndInitInfo,viewController.list_all);

router.get("/list-image",verifyTokenAndInitInfo,viewController.images_all);

router.get("/space/:id",verifyTokenAndInitInfo,viewController.teamSpace);


module.exports = router;