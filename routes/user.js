const userController = require("../controller/userController");
const securityController = require("../controller/securityController");
const router = require("express").Router();


const verifyAdmin = securityController.verifyAdmin;

const verifyUserCur = securityController.verifyCurrentUser;
// Add new User
router.post("/", userController.addUser);

router.get("/users",securityController.verifyToken, userController.getAllUser);

router.get("/:id",verifyUserCur, userController.getUser);

router.put("/:id",verifyUserCur, userController.updateUser);

router.delete("/:id",verifyAdmin, userController.deleteUser);


module.exports = router;