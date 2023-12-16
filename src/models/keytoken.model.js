'use strict'

//!dmbg
const {model, Schema, Types} = require('mongoose'); // Erase if already required

const DOCUEMNT_NAME = 'Key'
const COLLECTION_NAME= 'Keys'
// Declare the Schema of the Mongo model
var keyTokenSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'Shop',
    },
    publicKey:{
        type:String,
        required:true,
    },
    privateKey:{
        type:String,
        required:true,
    },
    refreshTokensUsed:{
        type:Array,
        default:[], // RT đã đc sử dụng
    },
    refreshToken:{
        type:String,
        required:true,  //RT đang sử  dụng
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUEMNT_NAME, keyTokenSchema);