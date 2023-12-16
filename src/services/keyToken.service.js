'use strict'

const keytokenModel = require("../models/keytoken.model")
const { Types: { ObjectId } } = require('mongoose') 
class KeyTokenService {

    static createKeyToken = async ({userId, publicKey, privateKey, refreshToken}) => {
        try {
            //level 0
            // const tokens =  await keytokenModel.create({
            //     user:  userId,
            //     publicKey : publicKey,
            //     privateKey : privateKey
            // })
            // return tokens ? tokens.publicKey : null


            //level xxx
            const filter = { user: userId} , update = {
                publicKey, privateKey, refreshTokensUsed : [], refreshToken
            }, options = { upsert: true, new: true}

            const tokens =  await keytokenModel.findOneAndUpdate(filter, update, options)

            return tokens ? tokens.publicKey : null
        } catch (error) {
            console.log(error);
            return error
        }
    }

    static findByUserId = async ( userId ) => {
        console.log(userId);
        return await keytokenModel.findOne({ user: new  ObjectId(userId)}).lean() // tao schema la object id nen dung types chu de string find k dc
    }

    static removeKeyById = async ( id ) => {
        return await keytokenModel.deleteOne({ _id: new ObjectId(id) });
    }
}

module.exports = KeyTokenService