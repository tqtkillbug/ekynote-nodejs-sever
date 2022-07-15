const router = require("express").Router();
const authController = require("../controller/authController");


router.post("/register",authController.register);

router.post("/login",authController.login);

router.post("/refreshToken", authController.refreshToken);

router.get("/logout",authController.logout);

router.get("/google/callback",passport.authenticate('google', { failureRedirect: '/error' }),
function(req, res) {
  res.redirect('/');
});



module.exports = router;