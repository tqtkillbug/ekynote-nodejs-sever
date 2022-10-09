const router = require("express").Router();
const spaceController = require("../controller/spaceController");
const securityController = require("../controller/securityController");

const verifyToken = securityController.verifyToken;
const verifyTokenAndGetCurrUser = securityController.verifyTokenAndGetCurrUser;


router.post("/",verifyToken,spaceController.addNewSpace);

router.post("/add_mem",verifyTokenAndGetCurrUser,spaceController.addMember);

router.post("/invite_mem",verifyToken,spaceController.inviteMember);

router.post("/out_space",verifyTokenAndGetCurrUser,spaceController.outSpace);

router.get('/list', verifyToken, spaceController.loadListNote)



module.exports = router;