'use strict'

const {product, clothing, electronic} = require('../models/product.model')
const { BadRequestError } = require('../core/error.response')

//define Factory class to create product

class ProductFactory {
    /*
        type: 'Clothing
    */
    static async createProduct(type, payload) {
        switch (type) {
            case 'Electronics':
                return new Electronic(payload).createProduct()
            case 'Clothing':
                return new Clothing(payload).createProduct()
            default:
                throw new BadRequestError(`Invalid Product Types ${type}`)
        }
    }
}

//define base product class
class Product {
    constructor({
        product_name,
        product_thumb,
        product_description,
        product_price,
        product_quantity,
        product_type,
        product_shop,
        product_attributes
    }){
      this.product_name = product_name,
      this.product_thumb = product_thumb,
      this.product_description = product_description,
      this.product_price = product_price,
      this.product_quantity = product_quantity,
      this.product_type = product_type,
      this.product_shop = product_shop,
      this.product_attributes = product_attributes
    }

    //create new product
    async createProduct(){
        return await product.create(this)
    }
}

// define sub-class for different product types clothing
class Clothing extends Product{
    async createProduct(){
        console.log(this.product_attributes);
        const newClothing = await clothing.create(this.product_attributes)
        if(!newClothing) throw new BadRequestError('create new Clothing error')

        const newProduct = await super.createProduct()
        if(!newProduct)  throw new BadRequestError('create new Product error')

        return newProduct
    }
}

// define sub-class for different product types electronics
class Electronic extends Product{
    async createProduct(){
        const newElectronic = await electronic.create(this.product_attributes)
        if(!newElectronic) throw new BadRequestError('create new Electronic error')

        const newProduct = await super.createProduct()
        if(!newProduct)  throw new BadRequestError('create new Product error')

        return newProduct
    }
}


module.exports = ProductFactory

