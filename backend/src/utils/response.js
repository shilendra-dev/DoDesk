export const respondOk = (data, message) => {
    return {
        status: 200,
        entity: data,
        message,
        type: 'success'
    }
}

export const respondError = (status, message) => {
    return {
        status,
        message,
        type: 'error'
    }
}