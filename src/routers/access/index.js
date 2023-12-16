'use strict'

const express = require("express")
const accessController = require("../../controllers/access.controller")
const { asyncHandeler } = require("../../auth/checkAuth")
const router = express.Router()


//signUp
router.post('/shop/signup',asyncHandeler(accessController.signUp) )
router.post('/shop/login',asyncHandeler(accessController.login) )

module.exports = router
