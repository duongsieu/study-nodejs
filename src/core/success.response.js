'use strict'

const StatusCode = {
    OKE: 200,
    CREATED: 201
}

const ReasonStatusCode  = {
    OKE: 'Success',
    CREATED: 'Created'
}


class SuccessReponse {
    constructor ({message, statusCode = StatusCode.OKE, reasonStatusCode = ReasonStatusCode.OKE, metadata = {}}) {
        this.message = !message ?  reasonStatusCode : message
        this.status = statusCode,
        this.metadata = metadata
    }

    send(res, headers = {}) {
        return res.status( this.status).json( this)
    }
}

class OK extends SuccessReponse {
    constructor({ message, metadata}) {
        super({message, metadata})
    }
}

class CREATED extends SuccessReponse {
    constructor({options = {}, message,statusCode = StatusCode.CREATED ,reasonStatusCode = ReasonStatusCode.CREATED ,metadata}) {
        super({message,statusCode,reasonStatusCode ,metadata})
        this.options = options
    }
}

module.exports = {
    OK, CREATED,SuccessReponse
}