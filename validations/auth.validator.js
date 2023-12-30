const { check, validationResult } = require('express-validator');
const emailPattern = /^([a-zA-Z0-9._-]+)@([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,6})$/;

/** 
 * SEE DOCS VIA BELOW LINK
 * https://express-validator.github.io/docs/index.html
 * https://flaviocopes.com/express-validate-input/
 * 
*/
module.exports = {
    loginRules: ()=>{
        return [
            check('email', 'Email is required.').notEmpty().isString().escape(),
            check('password', 'Password is required.').notEmpty().isString().escape()
        ]
    },
    registerRules: () => {
        return [
            check('username', 'Username is require').notEmpty().isString().escape(),
            check('email', 'Email is require').notEmpty().isString().custom((value) => emailPattern.test(value)).escape(),
            check('password', 'Password is require').notEmpty().isString().isLength({ min: 6 }).escape(),
            check('confirmPassword', 'Confirm Password is require').notEmpty().isString().escape(), //.isLength({ min: 6 }),
            check('confirmPassword', 'Confirm Password does not match with Password').exists().custom((value, { req }) => value === req.body.password),
        ]
    }
}
