'use strict'

const express = require("express")
const accessController = require("../../controllers/access.controller")
const { asyncHandeler } = require("../../helpers/asyncHandler")
const { authentication } = require("../../auth/authUtils")
const router = express.Router()


//signUp
router.post('/shop/signup',asyncHandeler(accessController.signUp) )
router.post('/shop/login',asyncHandeler(accessController.login) )


// authen
router.use(authentication)
router.post('/shop/logout',asyncHandeler(accessController.logout) )

module.exports = router
