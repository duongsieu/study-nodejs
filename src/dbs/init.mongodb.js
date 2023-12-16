'use strict'

const mongoose = require('mongoose')
const {db: {host, name, port}} = require('../configs/config.mongodb')
const connectString = `mongodb://${host}:${port}/${name}`

class Database {

    constructor() {
        this.connect()
    }
    //connect
    connect(type = 'mongodb') {
        //dev
        if(1 === 0) {
            mongoose.set('debug', true)
            mongoose.set('debug', { color: true})
        }
        console.log(connectString)

        mongoose.connect(connectString, {
            maxPoolSize: 50
        } ).then ( _ => console.log(`Connected mongo success Pro`))
        .catch ( err => console.log(`Error connect mongo`))
    }

    static getInstance() {
        if(!Database.instance) {
            Database.instance = new Database()
        }

        return Database.instance
    }
}

const instanceMongoDb = Database.getInstance()
module.exports = instanceMongoDb