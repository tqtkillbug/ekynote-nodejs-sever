const {
    Keyword,
    User,
    LogIP,
    TeamSpace,
    Notification
} = require("../../model/model");
var ObjectId = require('mongoose').Types.ObjectId; 
const commonService = require('../common/common.service');
const notiService  = {
    
    getListNotiOfUser : async (useId) => {
        const lstNoti = await Notification.find({idReceiver : useId, isDelete:0}).sort({'createdAt': 'desc'});
        let lstNotiConvert = [];
        let countNotSeen = 0;
        for (const noti of lstNoti) {
             const notiObj = {
                idNoti : noti.id,
                content : noti.content,
                isSeen : noti.isSeen,
                type : noti.type,
                spaceInviteId : noti.spaceInviteId,
                relativeTime : commonService.timeAgo(noti.createdAt)
             }
            
             lstNotiConvert.push(notiObj);
        }
        const result = {
            lstNoti : lstNotiConvert,
            notifyCount : lstNotiConvert.length
        }
        return result;
    },
    createNotify :async(type,content,spaceInviteId,idSender,idReceiver)=>{
         try {
             if (type && content && idSender && idReceiver) {
                const newNotify = new Notification();
                newNotify.type = type;
                newNotify.content = content;
                newNotify.idSender = idSender;
                newNotify.idReceiver = idReceiver;
                if (type == 3) {
                    if (spaceInviteId) {
                        newNotify.spaceInviteId = spaceInviteId;
                    } else return false;
                }
               const savedNotify = await newNotify.save();
               if (savedNotify) {
                  return true
               }
            } 
            return false;
         } catch (error) {
            return false;
         }
    }, 
    hideNotify: async(idNoti)=>{
        try {
           const deleteNotify = await Notification.findByIdAndUpdate(idNoti,{isDelete: 1});
           if (deleteNotify) {
             return true;
           }
        } catch (error) {
            return false;
        }
    }
}

module.exports = notiService;