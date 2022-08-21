const { json } = require("body-parser");
const bodyParser = require("body-parser");
const { get } = require("mongoose");
const {User, Keyword, Favorite}  = require("../model/model");
const { getAllUser } = require("./userController");
const constant = require('../configs/contain');
const e = require("express");


const keywordController = {
    addKeyword: async(req, res) =>{
        try {
            if(req.user){
                const keyword = new Keyword(req.body);
                keyword.user = req.user.id;
                const saveKeyword = await keyword.save();
             return  res.status(200).json(saveKeyword);  
            } else{
                return res.status(403).json("User Not Authencation");
            }
        } catch (error) {
            res.status(500).json(error);
        }
    },

    getAllKeyword: async(req,res) =>{
       try {
        if(req.user){
        var page = parseInt(req.query.page); 
        if(!page || page < 0){
             return res.status(200).json(null);
         } 
         var skip = (page -1 ) * constant.PAGE_SIZE_NOTES;
         var keywords = null;
         var count = 0;
         const user = await User.findById(req.user.id);
         if(user.admin == true){
            keywords = await Keyword.find({type: { "$in" : ["1","2"]}}).sort({'createdAt': 'desc'}).skip(skip).limit(constant.PAGE_SIZE_NOTES);;
            count  = await Keyword.find().count();
         } else {
            keywords = await Keyword.find({user: req.user.id, type: { "$in" : ["1","2"]} }).sort({'createdAt': 'desc'}).skip(skip).limit(constant.PAGE_SIZE_NOTES);
             count = await Keyword.find({user: req.user.id}).count();
        } 
        return res.status(200).json({keywords,count});
        } else{
            return res.status(403).json("Authentication failed");
        }
       } catch (error) {
        res.status(500).json(error);
       }
    },
    getAllImage: async(req,res) =>{
        try {
            if(req.user){
            var page = parseInt(req.query.page); 
            if(!page || page < 0){
                 return res.status(200).json(null);
             } 
             var skip = (page -1 ) * constant.PAGE_SIZE_NOTES;
             var keywords = null;
             var count = 0;
             keywords = await Keyword.find({user: req.user.id, type: { "$in" : ["3"]} }).sort({'createdAt': 'desc'}).skip(skip).limit(constant.PAGE_SIZE_NOTES);
             count = await Keyword.find({user: req.user.id,type: { "$in" : ["3"]} }).count();
             console.log( req.user.id);
            } 
            return res.status(200).json({keywords,count});
           } catch (error) {
            res.status(500).json(error);
           }
    }
    ,
    updateContent : async(req,res) =>{
        try {
           const noteId = req.body.id;
           const newContent = req.body.newContent;
           if(noteId && newContent){
            const currNote = await Keyword.findById(noteId);
            if(currNote){
            if(currNote.user.valueOf() !== req.user.id){
               return res.status(403).json("User not have access");
            }
            const newNote =  await Keyword.findByIdAndUpdate( {_id: currNote._id},{$set:{"content": newContent}},  {new: true})
            return res.status(200).json(newNote); 
            }
           }
        } catch (error) {
            return res.status(500).json(error);
        }
    },
    getCount : async(req,res) =>{
        try {
            var ObjectId = require('mongodb').ObjectId; 
            var idParam = req.user.id;       
            var user = new ObjectId(idParam);
            Keyword.aggregate([
                { "$facet": {
                  "Keyword": [
                    {
                   "$match": {
                        "$and": [ 
                            {"type": { "$in":["1"] }}, 
                            {"user" : user},
                            {"isDelete" : 0}
                        ]
                   }
                  },
                    { "$count": "Keyword" },
                  ],
                  "Code": [
                    { "$match" : {
                        "$and": [ 
                            {"type": { "$in":["2"] }}, 
                            {"user" : user},
                            {"isDelete" : 0}
                        ]
                    }},
                    { "$count": "Code" }
                  ],
                  "Image": [
                    { "$match" : {
                        "$and": [ 
                            {"type": { "$in":["3"] }}, 
                            {"user" : user},
                            {"isDelete" : 0}
                        ]
                    }},
                    { "$count": "Image" }
                  ]
                }},
                { "$project": {
                  "keywordCount": { "$arrayElemAt": ["$Keyword.Keyword", 0] },
                  "codeCount": { "$arrayElemAt": ["$Code.Code", 0] },
                  "imageCount": { "$arrayElemAt": ["$Image.Image", 0] }
                }}
              ]).exec((err, result) => {
                if (err) throw err;
                const dataCount  = result[0];
                const total = dataCount.keywordCount + dataCount.codeCount + dataCount.imageCount;
                dataCount.percentKeyword  = Number.parseInt(dataCount.keywordCount / total * 100);
                dataCount.percentCode  = Number.parseInt(dataCount.codeCount / total * 100);
                dataCount.percentImage  = Number.parseInt(dataCount.imageCount / total * 100);
                res.status(200).json(dataCount);
            })

        } catch (error) {
            return res.status(500).json(error);
        }
    },
    favorite : async(req,res) =>{
        try {
            if(req.user.valueOf()){
                if(req.body.noteId){
                    const favoriteInit = new Favorite();
                    favoriteInit.userId = req.user.id;
                    favoriteInit.noteId = req.body.noteId;
                    // const favorite = await Keyword.save(favoriteInit);
                    // res.status(200).json(favorite);
                }
            }
            res.status(400).json("Param is reqire");
           
        } catch (error) {
            res.status(500).json(error);
        }
    }

}


module.exports = keywordController;
