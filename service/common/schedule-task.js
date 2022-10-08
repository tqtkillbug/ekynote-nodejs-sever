const cron = require('node-cron');
const {User, Keyword} = require("../../model/model");
const cloudinary = require('cloudinary').v2;
const containCommon = require('../../configs/contain');
 
exports.initScheduledJobs = () => {

const clearCloudinaryStrogare = cron.schedule(containCommon.CRON_EXPRESSION_RUN_2AM_AT_MONDAY, () =>  {
  console.log('DEMO');
}, {
  scheduled: true,
  timezone: "Asia/Ho_Chi_Minh"
});
clearCloudinaryStrogare.start();

  
}