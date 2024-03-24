'use strict'

const ProductService = require("../services/product.service")
const ProductServiceV2 = require("../services/product.xxx.service")
const {OK, CREATED,SuccessReponse} = require('../core/success.response')

class ProductController {
    createProduct =  async (req, res, next) => {
        // return new SuccessReponse({
        //     message: 'Create new Product success!',
        //     metadata: await ProductService.createProduct(
        //         req.body.product_type,
        //         {
        //             ...req.body,
        //             product_shop: req.user.userId
        //         }
        //     )
        // }).send(res)
        return new SuccessReponse({
            message: 'Create new Product success!',
            metadata: await ProductServiceV2.createProduct(
                req.body.product_type,
                {
                    ...req.body,
                    product_shop: req.user.userId
                }
            )
        }).send(res)
    }
}

module.exports = new ProductController()