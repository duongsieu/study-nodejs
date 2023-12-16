'use strict'

const HEADER = {
    API_KEY : 'x-api-key',
    AUTHORIZATION : 'authorization'
}

const apikeyModel = require('../models/apikey.model')
const { findByid} = require('../services/apikey.service')

const crypto = require('crypto')
const apiKey = async (req, res, next) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString()
        if(!key) {
            return res.status(403).json({
                message: 'Forbidden Error'
            })
        }

        //check objkey
        const objKey = await findByid(key)

        if(!key) {
            return res.status(403).json({
                message: 'Forbidden Error'
            })
        }

        req.objKey = objKey
        return next()
    } catch (error) {

    }
}


const permission = (permission) => {
    return (req, res, next) => {
        if(!req.objKey.permission) {
            return res.status(403).json({
                message: 'Permission denied'
            })
        }

        const validPermission = req.objKey.permission.includes(permission)
        if(!validPermission) {
            return res.status(403).json({
                message: 'Permission denied'
            }) 
        }

        return next()
    }
}

module.exports = {
    apiKey,
    permission,
}