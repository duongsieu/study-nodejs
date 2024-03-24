'use strict'

const ProductService = require("../services/product.service")
const {OK, CREATED,SuccessReponse} = require('../core/success.response')

class ProductController {
    createProduct =  async (req, res, next) => {
        return new SuccessReponse({
            message: 'Create new Product success!',
            metadata: await ProductService.createProduct(
                req.body.product_type,
                req.body
            )

        }).send(res)
    }
}

module.exports = new ProductController()