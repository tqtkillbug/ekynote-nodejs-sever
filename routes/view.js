const router = require("express").Router();
const viewController = require("../controller/viewController");



router.get("/login",viewController.showLogin);

router.get("/register",viewController.showRegister);

router.get("/",viewController.dashboard);

router.get("/list",viewController.list_all);

router.get("/list-image",viewController.images_all);


module.exports = router;