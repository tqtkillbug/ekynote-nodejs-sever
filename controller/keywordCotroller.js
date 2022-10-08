const { json } = require("body-parser");
const bodyParser = require("body-parser");
const { get } = require("mongoose");
const {User, Keyword}  = require("../model/model");
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
        var startDateParam = req.query.startDate; 
        var endDateParam = req.query.endDate; 
        var page = parseInt(req.query.page); 
        var typeKeyword = ["1","2"];
        var filterDate = {
                "$gte": new Date("2022-01-01"), 
                "$lt": new Date("2100-01-01"),
        }
        var defaultFavo = {
            "$in":[1,0]
        }
        var groupType = {
            'createdAt': 'desc'
        }
        var startDate;
        var endDate;
        var textSearch = "";
         
        var skip = (page -1 ) * constant.PAGE_SIZE_NOTES;
        var keywords = null;
        var count = 0;
       
        if(!page || page < 0){
             return res.status(200).json(null);
         }
         if(req.query.type != undefined && req.query.type !== null && req.query.type !== ""){
            typeKeyword  = req.query.type.split(",");
         }
         var type = {
            "$in":typeKeyword
         }
         if (typeKeyword.includes("3")) {
            type = {
                "$in":["1","2"]
            }
            if(typeKeyword.includes("1") && typeKeyword.includes("2")){
                type = {
                    "$in":["1","2"]
                }
            }
            if(typeKeyword.includes("1") && !typeKeyword.includes("2")){
                type = {
                    "$in":["1"]
                }
            }
            if(!typeKeyword.includes("1") && typeKeyword.includes("2")){
                type = {
                    "$in":["2"]
                }
            }
            defaultFavo = {
                "$in":[1]
            }
         }

         if(req.query.startDate != undefined && req.query.startDate !== null && req.query.startDate !== "" && req.query.endDate != undefined && req.query.endDate !== null && req.query.endDate !== ""){
            startDate = new Date(startDateParam);
            endDate = new Date(endDateParam);
            filterDate = {
                    "$gte": startDate, 
                    "$lt": endDate,
           }  
         }
         if(req.query.textSearch != undefined && req.query.textSearch !== null && req.query.textSearch !== ""){
            textSearch  = req.query.textSearch;
         }

         if(req.query.typeGroup != undefined && req.query.typeGroup !== null && req.query.typeGroup !== ""){
            if (req.query.typeGroup == "2") {
                groupType = {
                    'hostName': 'desc'
                }
            }
         }
       
         keywords = await Keyword.find(
        {user: req.user.id,
         type: type,
         isDelete : 0,  
         isFavorite : defaultFavo,
         createdAt:filterDate, 
         "$or": [
            {content: { $regex: textSearch, $options: "i" }},
            { titlePage: { $regex: textSearch, $options: "i" }},
            { hostName: { $regex: textSearch, $options: "i" }} ]
        })
        .sort(groupType)
        .skip(skip)
        .limit(constant.PAGE_SIZE_NOTES);
        
        count = await Keyword.find(
            {user: req.user.id,
                type: type,
                isDelete : 0,  
                isFavorite : defaultFavo,
                createdAt:filterDate, 
                "$or": [
                   {content: { $regex: textSearch, $options: "i" }},
                   { titlePage: { $regex: textSearch, $options: "i" }},
                   { hostName: { $regex: textSearch, $options: "i" }} ]
               }).count();
        return res.status(200).json({keywords,count,groupType});
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
             var skip = (page -1 ) * constant.PAGE_SIZE_IMAGES;
             var keywords = null;
             var count = 0;
             keywords = await Keyword.find({user: req.user.id, type: { "$in" : ["3"]}, isDelete : 0 }).sort({'createdAt': 'desc'}).skip(skip).limit(constant.PAGE_SIZE_IMAGES);
             count = await Keyword.find({user: req.user.id,type: { "$in" : ["3"]}, isDelete : 0 }).count();
            } 
            return res.status(200).json({keywords,count});
           } catch (error) {
            res.status(500).json(error);
           }
    },
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
                dataCount.keywordCount = dataCount.keywordCount == null ? 0 : dataCount.keywordCount;
                dataCount.codeCount = dataCount.codeCount == null ? 0 : dataCount.codeCount;
                dataCount.imageCount = dataCount.imageCount == null ? 0 : dataCount.imageCount;
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
            if(req.user){
                if(req.body.noteId){
                    const noteId = req.body.noteId;
                  const currNote = await Keyword.findById(noteId);
                  var isFavorite;
                  if(currNote.user.valueOf() !== req.user.id){
                    return res.status(403).json("User not have access");
                  }
                  if(currNote.isFavorite ==  0){
                    isFavorite = 1;
                  } else if(currNote.isFavorite ==  1){
                    isFavorite = 0;
                  } else{
                    return res.status(400).json("Faild Try Again");
                  }
                 const newNote =  await Keyword.findByIdAndUpdate( {_id: currNote._id},{$set:{"isFavorite": isFavorite}},  {new: true});
               return  res.status(200).json(newNote);
                }
            }
            return  res.status(400).json("Param is require");
           
        } catch (error) {
            res.status(500).json(error);
        }
    }, 
    deleteKeyword: async(req,res)=>{
        try {
            const noteId = req.query.id;
            const currNote = await Keyword.findById(noteId);
            if(currNote.user.valueOf() !== req.user.id){
                return res.status(403).json("User not have access");
              }
            const newNote =  await Keyword.findByIdAndUpdate( {_id: currNote._id},{$set:{"isDelete": 1}},  {new: true})
            return res.status(200).json("success");
        } catch (error) {
            return res.status(500).json(error);
        }
    },
    

}


module.exports = keywordController;
