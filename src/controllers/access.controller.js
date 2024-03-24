'use strict'

const AccessService = require("../services/access.service")
const bycrypt =  require('bcrypt')

const {OK, CREATED,SuccessReponse} = require('../core/success.response')
const { findByEmail } = require("../services/shop.service")
const { AuthFailureError } = require("../core/error.response")
class AccessController {
    login =  async (req, res, next) => {
        return new SuccessReponse({
            metadata: await AccessService.login(req.body)
        }).send(res)
    }
    logout =  async (req, res, next) => {
        return new SuccessReponse({
            message: 'Logout sucess!',
            metadata: await AccessService.logout(req.keyStore)
        }).send(res)
    }
    handlerRefreshToken =  async (req, res, next) => {
        // return new SuccessReponse({
        //     message: 'Get token Success!',
        //     metadata: await AccessService.handleRefreshToken( req.body.refreshToken)
        // }).send(res)

        //v2 fixed, no need accessToken
        console.log(req.user);
        return new SuccessReponse({
            message: 'Get token Success!',
            metadata: await AccessService.handleRefreshTokenV2({
                keyStore: req.keyStore,
                user: req.user,
                refreshToken: req.refreshToken,
            } )

        }).send(res)
    }
    signUp  = async ( req , res, next) => {
        return new CREATED({
                message: 'Regiserter Ok',
                metadata: await AccessService.signUp(req.body),
                options: {
                    limit: 10
                }
            }).send(res)
    }
}

module.exports = new AccessController()