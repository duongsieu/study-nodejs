'use strict'

const shopModel = require("../models/shop.model")
const bycrypt =  require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require("./keyToken.service")
const { createTokenPair,verifyJWT } = require("../auth/authUtils")
const { getInfoData } = require("../utils")
const { BadRequestError, ConflicRequestError, AuthFailureError, ForbiddenError } = require("../core/error.response")
const { findByEmail } = require("./shop.service")

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {

    /*
        1- check email in dbs
        2 -  match password
        3 - create AT and  RT and save
        4 - generate tokens
        5- get data return login
    */
    static login  = async  ({email, password, refreshToken = null}) => {
        //1.
        const foundShop = await findByEmail({email})
        if(!foundShop) throw new BadRequestError('Shop not register')
        //2.
        const match = bycrypt.compare(password, foundShop.password)
        if(!match) throw new AuthFailureError('Authentication error')

        //3.
        const publicKey = crypto.randomBytes(64).toString('hex')
        const privateKey = crypto.randomBytes(64).toString('hex')

        //4.
        const tokens = await createTokenPair({userId: foundShop._id, email}, publicKey, privateKey )

        await KeyTokenService.createKeyToken({
            userId: foundShop._id,
            publicKey,
            privateKey,
            refreshToken: tokens.refreshToken
        })


        return {
            metadata: {
                shop: getInfoData({fileds : ['_id', 'name', 'email'], object: foundShop }),
                tokens
            }
        }
    }

    static handleRefreshToken = async ( refreshToken) => {
        //check xem token da duoc su dung chua 
        const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken)
        if(foundToken) {
            // decode xem may la then nao? 
            const { userId , email} = await verifyJWT(refreshToken, foundToken.privateKey)
            // xoa tat ca token trong key store
            await KeyTokenService.deleteKeyByUserId(userId)
            throw new ForbiddenError('Something wrong happend !! Pls relogin')
        }

        const holderToken =  await KeyTokenService.findByRefreshToken(refreshToken)
        console.log('holderToken', holderToken);
        if(!holderToken) throw new AuthFailureError('Shop not registeted 1')

        //verify tokne
        const { userId , email} = await verifyJWT(refreshToken, holderToken.privateKey)

        //check user
        const foundShop = await findByEmail( email)
        if(!holderToken) throw new AuthFailureError('Shop not registeted 2')

        // create 1 cap token moi
        const tokens = await createTokenPair({userId: userId, email}, holderToken.publicKey, holderToken.privateKey )

        //update token
        await holderToken.updateOne({
            $set: {
                refreshToken:  tokens.refreshToken
            },
            $addToSet: {
                refreshTokensUsed:  refreshToken //da duoc su dung de lay token moi roi nen add vao da su dung
            }
        })

        return {
            user : {userId , email},
            tokens
        }
    }

    static handleRefreshTokenV2 = async ({keyStore, user, refreshToken} ) => {
        const { userId , email} = user;

        if(keyStore.refreshTokensUsed.includes(refreshToken)){
            await KeyTokenService.deleteKeyByUserId(userId)
            throw new ForbiddenError('Something wrong happend !! Pls relogin')
        }

        if(keyStore.refreshToken !== refreshToken) throw new AuthFailureError('Shop not registeted')

        const foundShop = await findByEmail({email})
        if(!foundShop) throw new AuthFailureError('Shop not registeted 2')

        // create 1 cap token moi
        const tokens = await createTokenPair({userId: userId, email}, keyStore.publicKey, keyStore.privateKey )

        //update token
        await keyStore.updateOne({
            $set: {
                refreshToken:  tokens.refreshToken
            },
            $addToSet: {
                refreshTokensUsed:  refreshToken //da duoc su dung de lay token moi roi nen add vao da su dung
            }
        })

        return {
            user,
            tokens
        }
    }

    static signUp = async ({name, email, password}) => {
        try {
            //step1: check email exists
            const holderShop = await shopModel.findOne({email}).lean() //lean giúp giảm size object , lean trả object javascrip thuần tuý

            if(holderShop) {
                throw new BadRequestError('Error: SHop already registered')
            }

            const passwordHash = await bycrypt.hash(password, 10)
            const newShop = await shopModel.create({
                name, email, password: passwordHash, roles: [RoleShop.SHOP]
            })

            if(newShop){
                //created privateKey, publickey
                // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
                //     modulusLength: 4096,
                //     publicKeyEncoding: {
                //         type: 'pkcs1',
                //         format: 'pem'
                //     },
                //     privateKeyEncoding: {
                //         type: 'pkcs1',
                //         format: 'pem'
                //     }
                // })
                const privateKey = crypto.randomBytes(64).toString('hex')
                const publicKey = crypto.randomBytes(64).toString('hex')
                const tokens = await createTokenPair({userId: newShop._id, email}, publicKey, privateKey )

                //create token pair
                const keyStore =  await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey,
                    privateKey,
                    tokens : tokens.refreshToken
                })

                if(!keyStore){
                    return {
                        code: 'xxxx',
                        message: 'keyStore error'
                    }
                }

                return {
                    shop: getInfoData({fileds : ['_id', 'name', 'email'], object: newShop }),
                    tokens
                }
            }
        } catch (error) {
            return {
                code: 'xxx',
                message: error.message,
                status: 'error'
            }
        }
    }

    static logout =  async (keyStore)=> {
        const delKey = await KeyTokenService.removeKeyById(keyStore._id)
        console.log(delKey );
        return delKey
    }
}

module.exports =  AccessService