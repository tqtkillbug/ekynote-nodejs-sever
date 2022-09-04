const router = require("express").Router();
const spaceController = require("../controller/spaceController");
const securityController = require("../controller/securityController");

const verifyToken = securityController.verifyToken;


router.post("/",verifyToken,spaceController.addNewSpace);



module.exports = router;