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
        res.render("dashboard");
    },
    list_all :(req,res) =>{
        res.render("list-all");
    },
    images_all :(req,res) =>{
        res.render("list-images");
    }

  
}


module.exports = viewController;