const keywordController = require("../controller/keywordCotroller");
const securityController = require("../controller/securityController");

const router = require("express").Router();
const verifyAdmin = securityController.verifyAdmin;

const verifyUserCur = securityController.verifyCurrentUser;

const verifyToken = securityController.verifyToken;

router.post("/", verifyToken,keywordController.addKeyword);

router.get("/keywords", verifyToken,keywordController.getAllKeyword);

module.exports = router;

