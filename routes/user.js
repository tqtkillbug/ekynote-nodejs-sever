const userController = require("../controller/userController");
const securityController = require("../controller/securityController");
const router = require("express").Router();

// Add new User
router.post("/", userController.addUser);

router.get("/users",securityController.verifyToken, userController.getAllUser);

router.get("/:id", userController.getUser);

router.put("/:id", userController.updateUser);

router.delete("/:id",securityController.verifyAdmin, userController.deleteUser);


module.exports = router;