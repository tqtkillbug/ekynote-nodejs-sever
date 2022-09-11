const { google } = require('googleapis')
const { models } = require('mongoose')
const stream = require('stream');
const express = require('express');
const {User, Keyword} = require("../model/model");

const GOOGLE_API_FOLDER_ID = '1G7gD4Qvs1s3As_j6Ub2DAVW5GSu0FREW';
const DOMAIL_IMAGE_DRIVE = 'https://lh3.googleusercontent.com/d/';

const driverService = {
  uploadFile: async function(req,res){
    try{
      if(!req.file){
        return res.status(401).json("Image not found");
      }
      const bufferStream = new stream.PassThrough();
      bufferStream.end(req.file.buffer);
      // const image = req.file;
        const auth = new google.auth.GoogleAuth({
            keyFile: './round-tome.json',
            scopes: ['https://www.googleapis.com/auth/drive']
        })
        const driveService = google.drive({
            version: 'v3',
            auth
        })
        const fileMetaData = {
            'name': "eky-i_" + Date.now()+ '.jpeg',
            'parents': [GOOGLE_API_FOLDER_ID]
        }
        const media = {
            mimeType: 'image/jpeg',
            body: bufferStream
        }
        const response = await driveService.files.create({
            resource: fileMetaData,
            media: media,
            field: 'id'
        })
        if (!response || !req.body.imageObj) {
           return res.status(500).json("Upload Error!")
        } 
         var keywordTypeImg = new Keyword(JSON.parse(req.body.imageObj));
         keywordTypeImg.content = DOMAIL_IMAGE_DRIVE + response.data.id;
         keywordTypeImg.user = req.user.id;
         const saveKeyword = await keywordTypeImg.save();
         if(saveKeyword){
             return res.status(200).json(saveKeyword);
         } 
         return res.status(500).json("Upload Error!");
    }catch(err){
      res.status(500).json(err);
    }
}
}

module.exports = driverService;
