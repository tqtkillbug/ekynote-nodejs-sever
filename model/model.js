const mongoose = require("mongoose");

const userChema = new mongoose.Schema({
    code:{
        type: String,
        require : true
    },
    name:{
        type: String
    },
    email:{
        type:String,
        require : true
    },
    password:{
        type: String,
        require:true
    },
    isDelete:{
        type:  Number,
        require: true
    },
    admin:{
        type: Boolean,
        default: false
    },
    keywords:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Keyword"
        }
    ]
}, {timestamps : true})

const keyWordSchema = new mongoose.Schema({
    id: {
        type:String,
        require: true
    },

    content:{
        type: String,
        require : true
    },
    url:{
        type: String,
        require : true
    },
    hostName:{
        type: String,
        require : true
    },
    titlePage:{
        type: String,
        require : true
    },
    favicon:{
        type: String,
        require : true
    },
    time:{
        type: String,
        require : true
    },
    type:{
        type: String,
        require : true
    },
    isDelete:{
        type: Number,
        require : true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
}, {timestamps : true})

let Keyword = mongoose.model("Keyword", keyWordSchema);
let User = mongoose.model("User", userChema);

module.exports = {Keyword, User};
