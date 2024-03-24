'use strict'

const express = require("express")
const accessController = require("../../controllers/access.controller")
const { asyncHandeler } = require("../../helpers/asyncHandler")
const { authentication, authenticationV2 } = require("../../auth/authUtils")
const router = express.Router()


//signUp
router.post('/shop/signup',asyncHandeler(accessController.signUp) )
router.post('/shop/login',asyncHandeler(accessController.login) )


// authen
router.use(authenticationV2)
router.post('/shop/logout',asyncHandeler(accessController.logout) )
router.post('/shop/handlerRefreshToken',asyncHandeler(accessController.handlerRefreshToken) )

module.exports = router
