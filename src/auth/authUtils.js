'use strict'

const JWT =  require ('jsonwebtoken')
const { asyncHandeler } = require("../helpers/asyncHandler")
const { AuthFailureError, NotFoundError } = require('../core/error.response')

//service
const {findByUserId} = require('../services/keyToken.service')
const HEADER = {
    API_KEY : 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION : 'authorization'
}

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        //accessToken
        const accessToken = await JWT.sign( payload, publicKey, {
            expiresIn: '2 days'
        })

        const refreshToken = await JWT.sign( payload, privateKey, {
            expiresIn: '7 days'
        })

        JWT.verify(accessToken, publicKey, (err, decode) => {
            if(err){
                console.error(`error verify::`, err)
            }else{
                console.log(`decode verify::`, decode)
            }
        })
        console.log(accessToken);
        console.log(refreshToken);
        return { accessToken, refreshToken}
    } catch (error) {
        console.log(error);
    }
}

const authentication = asyncHandeler ( async (req , res, next) => {
    /*
        1 -  Check userId missing ??
        2- Get accessToken
        3- Verify token
        4- Check user trong db?
        5- Check keyStore with this userId?
        6- Oke => return next
    */

    const userId =req.headers[HEADER.CLIENT_ID]
    if(!userId) throw new AuthFailureError('Invalid Request')

    const keyStore = await findByUserId(userId)
    if(!keyStore) throw new NotFoundError('Not found keyStore')

    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if(!accessToken) throw new AuthFailureError('Invalid Request')

    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
        if(userId !== decodeUser.userId) throw new AuthFailureError('Invalid UserId')
        req.keyStore = keyStore
        return next()
    } catch (error) {
        throw error
    }
})


module.exports = {
    createTokenPair,
    authentication
}