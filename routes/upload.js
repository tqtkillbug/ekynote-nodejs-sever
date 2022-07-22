const express = require('express');
const router = express.Router();
const fileUploader = require('../configs/cloudinary.config');
const {User, Keyword} = require("../model/model");
const cloudinaryService = require("../service/cloudinary.service");
const securityController = require("../controller/securityController");

const verifyUser = securityController.verifyCurrentUser;
const verifyAdmin = securityController.verifyAdmin;

router.post('/image',verifyUser,fileUploader.single('file'),cloudinaryService.uploadImage);
router.get("/admin/all-image",verifyAdmin,cloudinaryService.getAllImage);

module.exports = router;
