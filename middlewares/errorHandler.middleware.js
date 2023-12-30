const ErrorResponse = require("../utils/errorResponse.util");
const debug = require('debug')('bhx:err');
const httpConfig = require('./../configs/http.config');

//REQUESTED PAGE IS NOT FOUND
module.exports.notFound = (req, res, next) => {
    const error = new ErrorResponse(`Not Found - ${req.originalUrl}`, 404, httpConfig.request_not_found);
    res.status(404);
    next(error);
};

module.exports.errorHandler = (err, req, res, next) => {
    // const t0 = performance.now();
    debug(`Trace - ${err.stack}`);
    const statusCode = err.statusCode ? err.statusCode : 500;
    const body = err.body ? err.body : { code: statusCode, message: err.message };
    const pattern = /api/;
    const isApi = pattern.test(req.originalUrl);

    if (isApi)
        res.status(200).json({
            statusCode: body.code,
            isSuccess: !1,
            message: body.message,
            data: null,
            error: {
                code: statusCode + "" + body.code,
                body: Array.isArray(err.message) ? err.message : err.message.split(","),
            },
        });
    else
    {
        res.locals.message = err.message;
        res.locals.error = err;

        res
            .status(err.status || 500)
            .render('error');
    }

    // const t1 = performance.now();
    // console.log(`Took ${Math.round(t1 - t0)} milliseconds.`);
};