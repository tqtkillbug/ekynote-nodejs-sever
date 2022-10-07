const fileUploader = require('../configs/cloudinary.config');
const cloudinaryService = require("../service/cloudinary.service");
const securityController = require("../controller/securityController");
const router = require("express").Router();

const verifyToken = securityController.verifyToken;
const verifyAdmin = securityController.verifyAdmin;

router.post('/image',verifyToken,cloudinaryService.uploadImageByUrl);
// router.post('/image',verifyToken,fileUploader.single('file'),cloudinaryService.uploadImage);
// router.post('/image',verifyToken,upload.single('file'),driveSerice.uploadFile);
router.get("/admin/all-image",verifyAdmin,cloudinaryService.getAllImage);

module.exports = router;
