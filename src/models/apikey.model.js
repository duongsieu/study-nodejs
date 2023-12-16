'use strict'
//!dmbg
const {model, Schema, Types} = require('mongoose'); // Erase if already required

const DOCUEMNT_NAME = 'ApiKey'
const COLLECTION_NAME= 'ApiKeys'
// Declare the Schema of the Mongo model
var apiKeySchema = new Schema({
    key:{
        type: String,
        required: true,
        unique: true
    },
    status:  {
        type: Boolean,
        default: true,
    },
    permission: {
        type: [String],
        required: true,
        enum: ['0000','1111','2222']
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUEMNT_NAME, apiKeySchema);