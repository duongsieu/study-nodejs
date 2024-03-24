require('dotenv').config()
const compression = require('compression')
const express = require('express')
const { default: helmet} = require('helmet')
const morgan = require('morgan')
const app = express()

//init middlewares
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
// morgan('compile')
// morgan('common')
// morgan('short')
// morgan('tiny')


//init db
require('./dbs/init.mongodb')
//check count connect db
// const { checkOverload } = require('./helpers/check.connect')
// checkOverload()

//init route
app.use('', require('./routers'))

// handing error
app.use((error, req, res, next) => {
    const statusCode = error.status || 500
    return res.json({
        status: 'error',
        code: statusCode,
        stack: error.stack,
        message: error.message || 'Internal server error'
    })
})

//handing error


module.exports = app