const keywordController = require("../controller/keywordCotroller");
const securityController = require("../controller/securityController");

const router = require("express").Router();
const verifyAdmin = securityController.verifyAdmin;

const verifyUserCur = securityController.verifyCurrentUser;

const verifyToken = securityController.verifyToken;

router.post("/", verifyToken,keywordController.addKeyword);

router.post("/favorite", verifyToken,keywordController.favorite);

router.get("/keywords", verifyToken,keywordController.getAllKeyword);

router.get("/images", verifyToken,keywordController.getAllImage);

router.put("/", verifyToken,keywordController.updateContent);

router.get("/count", verifyToken,keywordController.getCount);


module.exports = router;

