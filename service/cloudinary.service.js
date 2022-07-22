const fileUploader = require('../configs/cloudinary.config');
const {User, Keyword} = require("../model/model");
const bodyParser = require("body-parser");
const { json } = require("body-parser");
const cloudinary = require('cloudinary').v2;
const containCommon = require('../configs/contain');

cloudinary.config({ 
    cloud_name: 'tqt-group', 
    api_key: '616969714772229', 
    api_secret: '_W76aUzdeX52JOpuPQahrlQ0QwQ' 
  });
  
const cloudinaryService = {
    uploadImage : async(req,res)=>{
        try {
            if (!req.file || !req.body.imageObj) {
                return res.status(500).json("Upload Error!")
              } 
               var keywordTypeImg = new Keyword(JSON.parse(req.body.imageObj));
               keywordTypeImg.content = req.file.path;
               keywordTypeImg.User = req.user.id;
               const saveKeyword = await keywordTypeImg.save();
               if(saveKeyword){
                   return res.status(200).json(saveKeyword);
               } 
               return res.status(500).json("Upload Error!sss");
        } catch (error) {
            return res.status(500).json(error);
        }
    },
    getAllImage :async(req,res)=>{ 
        cloudinary.api.resources({
            type: 'upload',
            prefix: containCommon.FOLDER_CLOUDINARY_FOR_IMAGE_USER_UPLOAD
          }, (error, result)=> {
            res.status(200).json(result);
        })
    }
}

module.exports = cloudinaryService;