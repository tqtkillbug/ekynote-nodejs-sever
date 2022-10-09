const {
    Keyword,
    User,
    LogIP,
    TeamSpace,
    Notification
} = require("../../model/model");
var ObjectId = require('mongoose').Types.ObjectId;
const notificationService = require('../app-service/notification.service');
const commonService = require("../common/common.service");

const teamSpaceService = {
    getInfoTeamSpace: async (id, user) => {
        try {
            const teamSpace = await TeamSpace.findOne({
                _id: new ObjectId(id),
                isDelete: 0
            }).populate('member', 'id name isDelete').populate('owner', 'id name isDelete');
            const checkMemberEsxitSpace = teamSpaceService.checkMemberEsxitSpace(user, teamSpace, 2);
            if (!checkMemberEsxitSpace) {
                return false;
            }
            if (teamSpace) {
                let isOwner = false;
                if (user.id == teamSpace.owner.id) {
                    isOwner = true;
                }
                const infoSpace = {
                    id: id,
                    nameSpace: teamSpace.name,
                    isOwner: isOwner,
                    owner: teamSpace.owner,
                    members: teamSpace.member,
                    memberCount: teamSpace.member.length,
                }
                return infoSpace;
            }
            return false;
        } catch (error) {
            return false;
        }
    },

    inviteMember: async (email, idSpace, owner) => {
        try {
            const member = await User.findOne({
                email: email,
                isDelete: 0
            });
            const space = await TeamSpace.findOne({
                _id: new ObjectId(idSpace),
                isDelete: 0
            }).populate('member', 'id isDelete');
            const checkMemberEsxitSpace = teamSpaceService.checkMemberEsxitSpace(member, space, 1);
            if (member) {
                if (checkMemberEsxitSpace) {
                    return `${member.name} joined this group`;
                }
                if (space) {
                    const notification = new Notification();
                    notification.type = 3;
                    notification.content = `${owner.fullName} invited you to space ${space.name}`;
                    notification.spaceInviteId = idSpace;
                    notification.idSender = owner.id;
                    notification.idReceiver = member.id;
                    const creationNoti = await notification.save();
                    if (creationNoti) {
                        return `Invitation sented to ${member.name}`
                    }
                } else {
                    return "Sapce is not exist!"
                }
            } else {
                return "Member is not exist!"
            }
        } catch (error) {
            return false;
        }
    },

    addMember: async (idNotify, idSpace, type, currUser) => {
        try {
            // Case agree to space
            if (idNotify && idSpace) {
                const space = await TeamSpace.findOne({
                    _id: new ObjectId(idSpace),
                    isDelete: 0
                });
                if (type == 1) {
                    let listMember = space.member;
                    listMember.push(currUser);
                    const updateSpace = await space.save(space);
                    const createNotify = await notificationService.createNotify(2,
                        `${currUser.name} accepted invitation to space ${space.name}`,
                        null,
                        currUser.id,
                        space.owner.id);
                    const deleteNotify = await notificationService.hideNotify(idNotify);
                    if (updateSpace && createNotify && deleteNotify) {
                        return true;
                    }
                    return false
                    // Case disagree to space
                } else if (type == 2) {
                    const createNotify = await notificationService.createNotify(2,
                        `${currUser.name} not accept your invitation to join space`,
                        null,
                        currUser.id,
                        space.owner.id);
                    const deleteNotify = await notificationService.hideNotify(idNotify);
                    if (createNotify && deleteNotify) {
                        return true;
                    }
                    return false
                }
            }
            return false
        } catch (error) {
            return false;
        }
    },


    getLstSpaceOfUser: async (user) => {
        try {
            const lstSpace = await TeamSpace.find({
                $or: [{
                    owner: user
                }, {
                    member: {
                        $elemMatch: {
                            $eq: new ObjectId(user)
                        }
                    }
                }]
            });
            // filter author or membership team space
            var lstSpaceOwner = [];
            var lstSpaceMember = [];
            lstSpace.forEach(space => {
                if (commonService.getIdFromObjectId(space.owner.toString()) == user.id) {
                    lstSpaceOwner.push(space);
                } else {
                    lstSpaceMember.push(space);
                }
            });
            return {
                lstSpaceMember: lstSpaceMember,
                lstSpaceOwner: lstSpaceOwner
            }
        } catch (error) {
            return false;
        }

    },
    outSpace: async (idSpace, user) => {
        try {
            const space = await TeamSpace.findOne({
                _id: new ObjectId(idSpace),
                isDelete: 0
            }).populate('member', 'id isDelete');
            const checkMemberEsxitSpace = teamSpaceService.checkMemberEsxitSpace(user, space, 1);
            if (checkMemberEsxitSpace) {
                space.member = space.member.filter(function (mem) {
                    return mem.id !== user.id
                })
                const updateMem = await space.save();
                if (updateMem) {
                    return true;
                }
            }
            return false;
        } catch (error) {
            return false;
        }
    },
    checkMemberEsxitSpace: (member, space, type) => {
        let memberIsMember = false;
        for (const memInSpace of space.member) {
            if (memInSpace.id == member.id) {
                memberIsMember = true;
            }
        }
        // Check user in member or owner space
        if (type == 2) {
            let isOwner = member.id == space.owner.id;
            if (isOwner || memberIsMember) {
                return true;
            }
        } else if (type == 1) {
            // only check member is member this space
          return memberIsMember 
        }
        return false;
    }
}

module.exports = teamSpaceService;