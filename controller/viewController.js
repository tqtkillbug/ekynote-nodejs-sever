const { json } = require("body-parser");
const bodyParser = require("body-parser");
const { get } = require("mongoose");
const {User, Keyword} = require("../model/model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const teamSpaceService = require("../service/app-service/teamSpace.service");

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
    teamSpace : async (req,res) =>{
        const spaceInfo = await teamSpaceService.getInfoTeamSpace(req.params.id,req.infoUser);
        if (!spaceInfo == false) {
            res.render("team-space", { info:req.infoUser, spaceInfo : spaceInfo})
            return; 
        }
        res.redirect('/404') 
    }

  
}




module.exports = viewController;