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

    index: (req,res) => {
        res.render("index");
    }

  
}


module.exports = viewController;