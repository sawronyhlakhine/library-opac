const { check, validationResult } = require('express-validator');
const ErrorResponse = require("../utils/errorResponse.util");
const httpConfig = require('./../configs/http.config');

module.exports = {
    // Validation
    validate: (req, res, next) => {

        const errors = validationResult(req);
    
        if (errors.isEmpty()) {
            return next();
        }
    
        const extractedErrors = []
        errors.array().map(err => extractedErrors.push(err.msg))

        let uniqueErrors = extractedErrors.filter((value, index, self) =>  self.indexOf(value) === index)

        const error = new ErrorResponse(uniqueErrors.join(","), 400, httpConfig.bad_request);
        res.status(400);
        next(error);

        // return res.status(200).json({
        //     status: 400,
        //     message: null,
        //     data: null,
        //     error: {
        //         errCode: 404,
        //         messages : uniqueErrors.join(",")
        //     }
        // });
    }
}