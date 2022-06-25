const jwt = require("jsonwebtoken");
const { use } = require("../routes/user");
const { generateToken } = require("../securitys/jwtAuthencation");


const securityController  = {
     
    verifyToken : (req,res,next) => {
         const token = req.headers.token;
         if(token){
            const accessToken = token.split(" ")[1];
            jwt.verify(accessToken, process.env.secret_key_jwt,(err,user) => { 
                if(err){
                    return  res.status(403).json("Fobiden user");
                }
                req.user = user;
                next();
            });
         } else{
          return res.status(401).json("Not Login!")
         }
    }, 
    verifyAdmin :(req,res, next) =>{
        securityController.verifyToken(req,res,() =>{
          if(req.user.id == req.params.id || req.user.admin){
            next();
          } else{
            return  res.status(403).json("Fobihide User not alowwed")
          }
        })
    },
}


module.exports = securityController;
