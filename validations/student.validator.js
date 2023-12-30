const { check } = require('express-validator');

/** 
 * SEE DOCS VIA BELOW LINK
 * https://express-validator.github.io/docs/index.html
 * https://flaviocopes.com/express-validate-input/
 * 
*/
module.exports = {
    detailsRules: ()=>{
        return [
            check('id', 'ID is required.').notEmpty().isString().escape()
        ]
    }
}
