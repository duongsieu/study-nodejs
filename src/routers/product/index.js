'use strict'

const express = require("express")
const productController = require("../../controllers/product.controller")
const router = express.Router()
const { asyncHandeler } = require("../../helpers/asyncHandler")
const { authenticationV2 } = require("../../auth/authUtils")



// authen
router.use(authenticationV2)
router.post('',asyncHandeler(productController.createProduct) )


module.exports = router
