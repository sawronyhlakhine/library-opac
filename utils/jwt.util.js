const jwt = require('jsonwebtoken');
const config = require('../configs/app.config');

/**
 * SEE DOCS AT NPM
 * https://www.npmjs.com/package/jsonwebtoken
 */

let self;
function Jwt() {
    self = this;
    self.SECRET_KEY = config.JWT.SECRET_KEY;
    self.EXPIRED_AT = config.JWT.EXPIRED_AT;
    self.ISSUER = config.JWT.ISSUER;
    self.TOKEN_NAME = config.JWT.TOKEN_NAME;
}

Jwt.prototype = {
    generateToken: (payload = {}) => {
        if (Object.entries(payload).length === 0) {
            payload = {
                name: self.TOKEN_NAME,
                issuedAt: Date()
            }
        }
        return new Promise((resolve, reject) => {
            jwt.sign(payload, self.SECRET_KEY, { expiresIn: self.EXPIRED_AT, issuer: self.ISSUER }, (err, encoded) => {
                if (err) reject(err);
                resolve(encoded);
            })
        })
    },

    verifyToken: (token = "") => {
        return new Promise((resolve, reject) => {
            if (token && token != "") {  
                jwt.verify(token, self.SECRET_KEY, (err, decoded) => {
                    if(err) resolve(null); //reject(err);
                    resolve(decoded);
                });
            }
            resolve(null);
            // reject("No Token Found");
        })
    },

    decodeToken: (token = "")=>{
        return new Promise((resolve, reject)=>{
            if (token && token != "") { 
                jwt.decode(token, self.SECRET_KEY, (err, decoded) =>{
                    if(err) reject(err)
                    resolve(decoded)
                })
            }
            reject("No Token Found");
        })
    }
}

module.exports = Jwt;


// const jwt = require("jsonwebtoken");
// module.exports.sign = async (user) => {
// 	const token = await jwt.sign({
// 			id: user.id,
// 			username: user.username,
// 			email: user.email
// 		},
// 		process.env.JWT_SECRET
// 	);
// 	return token;
// };

// module.exports.verify = async (token) => {
// 	const decoded = await jwt.verify(token, process.env.JWT_SECRET);
// 	return decoded;
// };