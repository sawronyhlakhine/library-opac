module.exports.api = (res, statusCode, message, status, response) => {
    let format = {
        statusCode: statusCode,
        isSuccess: status,
        message: message,
    };
    if(status)
        format = {...format, data: response, error: null} 
    else
        format = {...format, data: null, error: response}
    
    res.status(200).json(format)
}