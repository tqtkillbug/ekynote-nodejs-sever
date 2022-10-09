const jwt = require("jsonwebtoken");
const { User, TeamSpace } = require("../model/model");
const notiService = require("../service/app-service/notification.service"); 
const teamSpaceService = require("../service/app-service/teamSpace.service");

const securityController  = {
     
    verifyToken : (req,res,next) => {
         const token = req.cookies.accessToken;
         if(token){
            const accessToken = token.split(" ")[1];
            jwt.verify(accessToken, process.env.secret_key_jwt,(err,user) => { 
                if(err){
                    return res.status(403).json("Fobiden user");
                }
                req.user = user;
                next();
            });
         } else{
          return res.status(401).json("Not Login!")
         }
    }, 
    verifyTokenAndGetCurrUser : async (req,res,next) => {
      const token = req.cookies.accessToken;
      if(token){
         const accessToken = token.split(" ")[1];
         jwt.verify(accessToken, process.env.secret_key_jwt, async(err,user) => { 
             if(err){
                 return res.status(403).json("Fobiden user");
             }
             const userDb = await User.findById(user.id);
             req.user = userDb;
             next();
         });
      } else{
       return res.status(401).json("Not Login!")
      }
 }, 
    verifyAdmin :(req,res, next) =>{
        securityController.verifyToken(req,res,() =>{
          if(req.user.admin){
            next();
          } else{
            return  res.status(403).json("Fobihide User not alowwed")
          }
        })
    },
    verifyCurrentUser: (req,res, next) =>{
      securityController.verifyToken(req,res ,() =>{
        if(req.user.id == req.params.id){
          next();
        } else{
          return  res.status(403).json("Not have access");
        }
      })
    },
    verifyUserAndInitInfo : (req,res,next) =>{
      try {
        const token = req.cookies.accessToken;
        if(token){
              const accessToken = token.split(" ")[1];
              jwt.verify(accessToken, process.env.secret_key_jwt, async(err,user) => { 
                  if(err){
                      return res.redirect("/login");
                  }
                  req.user = user;
                  const userDb = await User.findById(user.id);
                  if (userDb && userDb.isDelete == 0) {
                    const notifis = await notiService.getListNotiOfUser(user.id);
                    // const listSpace = await TeamSpace.find({owner : userDb, isDelete: 0}); 
                    const listSpace = await teamSpaceService.getLstSpaceOfUser(userDb); 
                    const info = {
                       fullName : userDb.name,
                       email:userDb.email,
                       id: user.id,
                       listSpace: listSpace,
                       notification : notifis
                      }
                      req.infoUser = info;
                      next();
                  } else {
                      res.redirect('/error?code=403');
                  }
              });
           } else{
            return res.status(401).json("Not Login!")
           }
      } catch (error) {
        return res.status(500).json(error);
      }
    }
    
}


module.exports = securityController;
