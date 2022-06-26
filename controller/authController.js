const { json } = require("body-parser");
const bodyParser = require("body-parser");
const { get } = require("mongoose");
const {User, Keyword} = require("../model/model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


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
                code: req.body.code,
                name: req.body.name,
                email: req.body.email,
                password: hashed,
                isDelete: 0,
            });
            const user = await newUser.save();
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json(error);
        }
    },

    login: async (req,res) => {
        try {
            const user = await User.findOne({email: req.body.email});
            console.log(user);
            if(!user){
              return  res.status(404).json("Login Faild!");
            }
            const validPassword = await bcrypt.compare(
                req.body.password,
                 user.password
            );
            if(!validPassword){
                res.status(400).json("Login Faild!");
            }
            if(user && validPassword){
                const accessToken =  authController.generateToken(user, process.env.secret_key_jwt, "30s");
                const refreshToken =  authController.generateToken(user, process.env.secret_key_jwt_2, "6m");
                // res.cookie("accessToken", accessToken, {
                //     httpOnly: true,
                //     secure: true,
                //     sameSite: "strict"
                // });
                // res.cookie("refreshToken", refreshToken, {
                //     httpOnly: true,
                //     secure: true,
                //     sameSite: "strict"
                // });
                //  const {password, ...others} = user._doc;
                // res.status(200).json({...others, accessToken, refreshToken});
                res.status(200).json({user,validPassword,accessToken,refreshToken});
            }
        } catch (error) {
            res.status(500).json("Error");
        }
    },

    refreshToken: async (req,res) =>{
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return res.status(401).json("Not authenticated");
        jwt.verify(refreshToken,process.env.SECRET_KEY_JWT_2, (err, user) => {
            if(err){
            res.status(500).json(error);
            }
            const accessToken = authController.generateToken(user, process.env.secret_key_jwt, "2h")
            const newRefreshToken =  authController.generateToken(user, process.env.secret_key_jwt_2, "6m");
            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: false,
                sameSite: "strict"
            });
            res.cookie("newRefreshToken", newRefreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: "strict"
            });
            res.status(200).json({accessToken: newRefreshToken});
        });
    },
    logout: async (req,res) =>{
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

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
    }
}


module.exports = authController;