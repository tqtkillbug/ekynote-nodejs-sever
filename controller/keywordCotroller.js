const { json } = require("body-parser");
const bodyParser = require("body-parser");
const { get } = require("mongoose");
const {User, Keyword} = require("../model/model");
const { getAllUser } = require("./userController");

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
         var keywords = null;
         const user = await User.findById(req.user.id);
         if(user.admin == true){
            keywords = await Keyword.find();
         } else {
           keywords = await Keyword.find({user: req.user.id});
        } 
        return res.status(200).json(keywords);
        } else{
            return res.status(403).json("Authentication failed");
        }
       } catch (error) {
        res.status(500).json(error);
       }
    }
}


module.exports = keywordController;
