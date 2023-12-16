'use strict'

const StatusCode = {
    FORBIDEN: 403,
    CONFLICT: 409
}

const ReasonStatusCode  = {
    FORBIDEN: 'Bad request error',
    CONFLICT: 'Conflict error'
}

const {StatusCodes, ReasonPhrases} = require('../utils/httpStatusCode')

class ErrorResponse  extends Error {

    constructor(message, status) {
        super(message)
        this.status = status
    }
}


class ConflicRequestError extends ErrorResponse {
    constructor (message = StatusCode.CONFLICT, status = ReasonStatusCode.CONFLICT) {
        super(message,status)
    }
}

class BadRequestError extends ErrorResponse {
    constructor (message = StatusCode.CONFLICT, status = ReasonStatusCode.CONFLICT) {
        super(message,status)
    }
}

class AuthFailureError extends ErrorResponse {
    constructor (message = ReasonPhrases.UNAUTHORIZED, status = StatusCodes.UNAUTHORIZED) {
        super(message,status)
    }
}

module.exports = {
    ConflicRequestError,
    BadRequestError,
    AuthFailureError
}

