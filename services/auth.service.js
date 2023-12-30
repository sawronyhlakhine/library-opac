const { db } = require('../utils/db-mongo.util');
const ErrorResponse = require("../utils/errorResponse.util");
const httpConfig = require("../configs/http.config");
const jwtUtil = require('./../utils/jwt.util');
const bcrypt = require('bcryptjs');

const emailPattern = /^([a-zA-Z0-9._-]+)@([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,6})$/;
const DEFAULT_SALT_ROUNDS = 10;

let self;
function AuthService(){
    self = this;
    self.jwt = new jwtUtil();
}

AuthService.prototype = {
    register: (req) => {
        return new Promise(async (resolve, reject) => {
            let body = req.body || req.query,
                options = {};
            
            if (emailPattern.test(body.email)) 
                options.email = body.email;
            else
                reject(new ErrorResponse("Email was not correct.", 400, httpConfig.bad_request));

            let admin = await db.Admin.findOne(options);
            if (!admin) 
            {
                const encryptedPassword = await bcrypt.hash(
                    body.password,
                    DEFAULT_SALT_ROUNDS
                );
                let newAdmin = await db.Admin.create({
                    username: body.username,
                    email: body.email,
                    password: encryptedPassword,
                    status: 1,
                });
                if (newAdmin)
                    resolve({
                        _id: newAdmin._id,
                        name: newAdmin.name,
                        name: newAdmin.email
                    })
                else
                    reject(new ErrorResponse("Can not store Admin Account.", 500, httpConfig.server_error))
            }
            else 
                reject(new ErrorResponse("Email was already exist.", 400, httpConfig.user_already_exist));

        });
    },
    login:(req)=>{
        return new Promise(async (resolve, reject) => {

            let body = req.body,
                options = {};

            if (emailPattern.test(body.email)) 
                options.email = body.email;
            else
                reject(new ErrorResponse("Email was not correct.", 400, httpConfig.bad_request));

            let admin = await db.Admin.findOne(options);
            if (admin)
            {
                if (await bcrypt.compare(body.password, admin.password))
                {
                    let token = await self.jwt.generateToken({ id: admin._id });
                    admin.logged_out_at = null;
                    admin.save();
                    resolve({
                        id: admin._id,
                        username: admin.name,
                        email: admin.email,
                        accessToken: token
                    });
                }
                else 
                    reject(new ErrorResponse("Invalid Email Or Password", 400, httpConfig.login_failed))
            }
            else 
                reject(new ErrorResponse("Not Found", 404))
        })
    },
    logout:(req)=>{
        return new Promise(async(resolve, reject)=>{
            if (req.loggedUser) 
            {
                let admin = await db.Admin.findOne({_id: req.loggedUser?._id});
                if (admin)
                {
                    admin.logged_out_at = new Date();
                    admin.save();
                    resolve(true)
                }
            }
            reject(new ErrorResponse("Not Found", 404, httpConfig.user_not_found))
        })
    }
}

module.exports = AuthService;
