const httpConfig = require('../configs/http.config');
const ErrorResponse = require("../utils/errorResponse.util");
const { db } = require('../utils/db-mongo.util');
const JWT =require("../utils/jwt.util");
const jwt = new JWT();

exports.protect = async (req, res, next) => {
    try 
    {
        const { headers } = req;
        if (!headers.authorization) throw new ErrorResponse("Token not found in your request header.", 401, httpConfig.token_not_found);

        const token = headers.authorization.split(" ")[1];
        if (!token) throw new ErrorResponse("Token Missing Or Malformed", 401, httpConfig.token_not_found);

        const userVerified = await jwt.verifyToken(token);
        if (!userVerified) throw new ErrorResponse("Invalid Token", 401, httpConfig.token_malform);

        req.loggedUser = await db.Admin.findOne({ _id: userVerified.id});
        if (!req.loggedUser) next(new ErrorResponse("Who Are You?", 404, httpConfig.user_not_found));
        if (req.loggedUser.logged_out_at) next(new ErrorResponse("Please Sign-in and try again.", 404, httpConfig.already_logged_out))

        // headers.emailOrPhone = userVerified.email;
        req.loggedUser.token = token;
        next();

    } 
    catch (error) 
    {
        next(error);
    }
};
