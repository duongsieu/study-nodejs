'use strict'
'use strict'

//!dmbg
const {model, Schema, Types} = require('mongoose'); // Erase if already required

const DOCUEMNT_NAME = 'Product'
const COLLECTION_NAME= 'Products'

// Declare the Schema of the Mongo model
var proudctSchema = new Schema({
    product_name:{type:String, required:true},
    product_thumb:{type:String, required:true},
    product_description: String,
    product_price:{type:Number, required:true},
    product_quantity:{type:Number, required:true},
    product_type: {type:String, required:true, enum: ['Electronics', 'Clothing', 'Furniture'] },
    product_shop: {type: Schema.Types.ObjectId, ref: 'Shop'},
    product_attributes: { type : Schema.Types.Mixed, required: true }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//define the product type = clothing
const clothingSchema = new Schema({
    brand: {type:String, require :true},
    size: String,
    meterial: String,
    product_shop: {type: Schema.Types.ObjectId, ref: 'Shop'},
},{
    collection: 'clothes',
    timestamps: true
})

//define the product type = Electronics
const electronicSchema = new Schema({
    manufacturer: {type:String, require :true},
    model: String,
    color: String,
    product_shop: {type: Schema.Types.ObjectId, ref: 'Shop'},
},{
    collection: 'electronics',
    timestamps: true
})


//Export the model
module.exports ={
    product : model(DOCUEMNT_NAME, proudctSchema),
    electronic : model('Electronic', electronicSchema),
    clothing : model('Clothing', clothingSchema)
}