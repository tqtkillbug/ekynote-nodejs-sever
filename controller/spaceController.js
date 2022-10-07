const { User , TeamSpace, Keyword} = require("../model/model");



  
const spaceController = {

    addNewSpace : async (req,res)=>{
        try {
            const space = new TeamSpace(req.body);
            const user = await User.findById(req.user.id);
            if (space && user) {
                if (space.name == "" || space.name == undefined || space.name == null) {
                    return res.status(500).json("Space name Invalid");
                }
                space.user = user;
                space.idOwner = user.id;
                const spaceSaved = await space.save();
                return res.status(200).json(spaceSaved);
            } else {
                return res.status(500).json("Space Invalid");
            }    
        } catch (error) {
            res.status(500).json(error);
        }
    },
    addMem : async(req,res) =>{
      const email = req.body.email;
      if (email) {
         console.log(email);
      }
      res.status(200).send(email);
    }

}


module.exports = spaceController;

