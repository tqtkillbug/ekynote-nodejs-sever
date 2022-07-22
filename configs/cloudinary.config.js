const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
var random = require("randomstring");
const containCommon = require('../configs/contain');



cloudinary.config({ 
  cloud_name: 'tqt-group', 
  api_key: '616969714772229', 
  api_secret: '_W76aUzdeX52JOpuPQahrlQ0QwQ' 
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: containCommon.FOLDER_CLOUDINARY_FOR_IMAGE_USER_UPLOAD,
  },
  allowedFormats: ['jpg', 'png'],
  filename: function (req, file, cb) {
    cb(null,"eky-i_" + new Date().toISOString());
  }
});

const uploadCloud = multer({storage});

module.exports = uploadCloud;
