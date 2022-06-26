const { json } = require("body-parser");
const bodyParser = require("body-parser");
const { get } = require("mongoose");
const {User, Keyword} = require("../model/model");
const { getAllUser } = require("./userController");

const keywordController = {
    addKeyword: async(req, res) =>{
        try {
            const keyword = new Keyword(req.body);
            const saveKeyword = await keyword.save();
            // if(req.body.user){
            //     const user = User.find({id: req.body.user});
            //     await user.updateOne({$push: {keywords:saveKeyword.id}})
            // }
            res.status(200).json(keyword);
        } catch (error) {
            res.status(500).json(error);
        }
    },

    getAllKeyword: async(req,res) =>{
       try {
         const keywords = await Keyword.find();
         res.status(200).json(keywords);
       } catch (error) {
        res.status(200).json(error);
       }
    }
}


module.exports = keywordController;
