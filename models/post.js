const mongoose = require('mongoose'); 

const postSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    }
}) 

module.exports = mongoose.models.post || mongoose.model('post', postSchema) ;