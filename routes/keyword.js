const keywordController = require("../controller/keywordCotroller");
const router = require("express").Router();


router.post("/", keywordController.addKeyword);

router.get("/keywords", keywordController.getAllKeyword);

module.exports = router;

