const { json } = require("body-parser");
const bodyParser = require("body-parser");
const { get } = require("mongoose");
const {User, Keyword, LogIP} = require("../model/model");
const bcrypt = require("bcrypt");
const promisify = require('util').promisify;
const jwt = require("jsonwebtoken");
const e = require("express");
const verify = promisify(jwt.verify).bind(jwt);
const logger = require("../logger/logger")



const authController = {
    register: async (req,res) =>{
        try {
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);
            const userExsit = await User.findOne({email: req.body.email});  
           if (userExsit) {
              return res.status(300).json("Email has exsit!")
           } 
            const newUser = await new User({
                name: req.body.name,
                email: req.body.email,
                password: hashed,
                isDelete: 0,
            });
            const user = await newUser.save();
            user.password = null;
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json(error);
        }
    },

    login: async (req,res) => {
        try {
            const user = await User.findOne({email: req.body.email});
            if(!user){
              return  res.status(404).json("Login Faild!");
            }
            const validPassword = await bcrypt.compare(
                req.body.password,
                 user.password
            );
            if(!validPassword){
                logger.warn(`User: ${user.email} Login faild`)
                res.status(400).json("Login Faild!");
            }
            if(user && validPassword){
                const accessToken =  authController.generateToken(user, process.env.secret_key_jwt, "900s");
                let refreshToken = "";
                if(user.refreshToken){
                    refreshToken = user.refreshToken;
                } else{
                    refreshToken =  authController.generateToken(user, process.env.SECRET_KEY_JWT_2, "30d");
                    await User.findByIdAndUpdate( {_id: user._id},{$set:{"refreshToken": refreshToken}},  {new: true})
                }
                res.cookie("accessToken","BeaBearer "+ accessToken, {
                    httpOnly: true,
                    secure: false,
                    sameSite: "strict"
                });
                res.cookie("refreshToken","BeaBearer "+ refreshToken, {
                    httpOnly: true,
                    secure: false,
                    sameSite: "strict"
                });
                 const {password, ...others} = user._doc;
                 logger.info(`User: ${user.email} Login Success`)
                res.status(200).json({...others, accessToken, refreshToken});
            }
        } catch (error) {
            logger.error(error)
            res.status(500).json("Error");
        }
    },

    showLogin: (req,res) =>{
        res.render("login");
    },

    showRegister: (req,res) =>{
        res.render("register");
    },

    refreshToken: async (req,res) =>{
        const refreshToken = req.cookies.refreshToken.split(" ")[1];
        const accessToken = req.cookies.accessToken;
        var currUser;
        if(!accessToken) return res.status(401).json("Not found access token");
        if(!refreshToken) return res.status(401).json("Not found refresh token");
         
        jwt.verify(refreshToken, process.env.SECRET_KEY_JWT_2, { ignoreExpiration: true},(err,user) => { 
            if(err){
                return res.status(403).json("Fobiden user");
            }
           currUser = user;
        });
        const userData = await User.findOne({email: currUser.email});  
        if(!userData) return res.status(500).json("User not found");
        if(userData.refreshToken !== refreshToken) return res.status(403).json("Resfresh not valid");

        const newAccessToken = authController.generateToken(userData, process.env.secret_key_jwt, "900s")
        res.cookie("accessToken","BeaBearer "+ newAccessToken, {
           httpOnly: true,
           secure: false,
           sameSite: "strict"
       });
       return res.status(200).json({newAccessToken});
       
    },
    logout: async (req,res) =>{
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.redirect("/login");
    },
    generateToken:(user,secretKey,expiresIn) =>{
        return jwt.sign({
            id: user.id,
            email: user.email,
            admin: user.admin
        },
        secretKey,
        {expiresIn :  expiresIn}
         );
    },
   
    checkConnect: async(req,res) =>{
        try {
            var ip = (req.headers['x-forwarded-for'] || '').split(',').pop().trim() ||  req.socket.remoteAddress
            const newLogRq = await new LogIP({
                ip: ip,
                userId: null,
            });
            const logRq = await newLogRq.save();
            var token = req.body.token;
            if(!token) return res.status(401).json("Not authenticated");
                jwt.verify(token, process.env.secret_key_jwt,(err,user) => { 
                    if(err){
                        return  res.status(403).json("Fobiden user");
                    }
                    if(user){
                        const accessToken = authController.generateToken(user, process.env.secret_key_jwt, "2h")
                        const refreshToken =  authController.generateToken(user, process.env.SECRET_KEY_JWT_2, "6m");
                        res.cookie("accessToken","BeaBearer "+ accessToken, {
                            httpOnly: false
                        });
                        res.cookie("refreshToken","BeaBearer "+ refreshToken, {
                            httpOnly: false
                        });
                        return res.status(200).json({user,accessToken,refreshToken});
                    }
                });
        } catch (error) {
            return res.status(500).json(error);
        }
    }
}


module.exports = authController;