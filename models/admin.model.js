const mongoose = require("mongoose")

// let classes = ["Primary 1", "Primary 2"]

const adminSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true,
        // unique:true
    },

    email:{
        type:String,
        required:true,
        unique:true
    },

    password:{
        type:String,
        required:true,
        unique:true
    },

    lastLogin:{
        type:Date
    },
}, {timestamps:true, strict:true})




module.exports = adminSchema