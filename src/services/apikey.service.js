'use strict'

const apikeyModel = require("../models/apikey.model")

const findByid = async (key) => {
    const objKey = await apikeyModel.findOne( {key, status:  true}).lean()
    return objKey
}

module.exports = {
    findByid
}