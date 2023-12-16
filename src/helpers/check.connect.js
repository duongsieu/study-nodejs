'use strict'

const { log } = require("console")
const { default: mongoose } = require("mongoose")
const os = require('os')
const process = require('process')
const _SECOUNDS = 5000

//count connect
const countConnect = () => {
    const numConnection = mongoose.connections.length
    console.log(`Number of connection::${numConnection}`)
}

//check over load connect
const checkOverload= () => {
    setInterval( () => {
        const numberConnection = mongoose.connections.length
        const numCores = os.cpus().length
        const memoryUsage = process.memoryUsage().rss
        //example maxium number of connection based on number osf cores
        const maxConnections = numCores * 5

        // console.log(`Acctive connection:${numberConnection}`)
        // console.log(`Memory usage:${memoryUsage / 1024 / 1024} MB`)
        if(numberConnection > maxConnections) {
            console.log(`Connection overload detected`);
            //notify.send(.....)
        }


    }, _SECOUNDS) //Moniter every 5 secounds
}

module.exports = {
    countConnect,
    checkOverload
}