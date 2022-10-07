const bodyParser = require("body-parser");
const { get } = require("mongoose");
const {User, Keyword} = require("../model/model");

const userController = {

    addUser: async (req,res) =>{
      try {
        const newUser = new User(req.body);
        const saveUser = await newUser.save();
        res.status(200).json(newUser);
      } catch (error) {
        res.status(500).json(error);
      }
    },

    getAllUser: async(req,res) =>{
        try {
            const users = await User.find();
            return  res.status(200).json(users); 
        } catch (error) {
          return  res.status(500).json(error);
        }
    },
    getUser: async(req,res) =>{
    try {
      const user = await User.find({id: req.params.id});
         res.status(200).json(user);
     } catch (error) {
        res.status(500).json(error);
     }
    },

    updateUser : async(req,res) =>{
        try {
            const user = await User.findById(req.params.id); 
            await user.updateOne({ $set: req.body});
            res.status(200).json("Update user success!");
        } catch (error) {
        res.status(500).json(error);
        }
    },
    deleteUser : async(req,res) =>{
     try {
      const userDelete = await User.findByIdAndDelete(req.params.id);
      if(userDelete){
        res.status(200).json("Delete Sucess!");
      }
    } catch (error) {
      res.status(500).json(error);
     }
    }
}

module.exports = userController;