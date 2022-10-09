const {
    User,
    TeamSpace,
    Keyword
} = require("../model/model");
const teamSpaceService = require('../service/app-service/teamSpace.service');



const spaceController = {

    addNewSpace: async (req, res) => {
        try {
            const space = new TeamSpace(req.body);
            const user = await User.findById(req.user.id);
            if (space && user) {
                if (space.name == "" || space.name == undefined || space.name == null) {
                    return res.status(500).json("Space name Invalid");
                }
                space.owner = user;
                const spaceSaved = await space.save();
                return res.status(200).json(spaceSaved);
            } else {
                return res.status(500).json("Space Invalid");
            }
        } catch (error) {
            res.status(500).json(error);
        }
    },
    inviteMember: async (req, res) => {
        const email = req.body.email;
        const spaceId = req.body.idSpace;
        if (email) {
            const result = await teamSpaceService.inviteMember(email, spaceId, req.user);
            if (result == false) {
                res.status(500).json("Error");
                return;
            }
            res.status(200).json(result);
            return;
        } else {
            res.status(200).json("NOT_ESXIT");
            return;
        }
    },
    addMember: async (req, res) => {
        const idNotify = req.body.idNotify;
        const type = req.body.type;
        const spaceId = req.body.idSpace;
        const userDb = req.user;
        try {
            const addMember = await teamSpaceService.addMember(idNotify, spaceId, type, userDb);
            if (addMember) {
                res.status(200).json("Successful join in to space");
                return;
            }
            res.status(500).json("Execution error");
        } catch (error) {
            res.status(500).join("Execution error");
        }
    },
    outSpace : async(req,res)=>{
     try {
      const idSpace  = req.body.idSpace;
      if (idSpace) {
         const outSpace = await teamSpaceService.outSpace(idSpace,req.user);
         if (outSpace) {
           return res.status(200).json('Out space success!')
         }
      }
      return res.status(500).json(error);
     } catch (error) {
     res.status(500).json(error);
     }
    },
    loadListNote: async (req, res) => {

    }


}


module.exports = spaceController;