const { json } = require("body-parser");
const bodyParser = require("body-parser");
const { get } = require("mongoose");
const {User, Keyword} = require("../model/model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const viewController = {
   
    showLogin: (req,res) =>{
        res.render("login");
    },

    showRegister: (req,res) =>{
        res.render("register");
    },

    dashboard: (req,res) => {
       res.render("dashboard", { info:req.infoUser});
    },
    list_all :(req,res) =>{
        res.render("list-all", { info:req.infoUser});
    },
    images_all :(req,res) =>{
        res.render("list-images", { info:req.infoUser});
    },
    teamSpace :(req,res) =>{
        // console.log( req.params.id); 
        res.render("team-space", { info:req.infoUser}) 
    }

  
}




module.exports = viewController;