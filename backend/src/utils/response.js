exports.respondOk = (data, message) => {
    return {
        status: 200,
        entity: data,
        message,
        type: 'success'
    }
}

exports.respondError = (status, message) => {
    return {
        status,
        message,
        type: 'error'
    }
}