const { check } = require('express-validator');

/** 
 * SEE DOCS VIA BELOW LINK
 * https://express-validator.github.io/docs/index.html
 * https://flaviocopes.com/express-validate-input/
 * 
*/
module.exports = {
    createRules: ()=>{
        return [
            check('name', 'Name is required.').notEmpty().isString().escape(),
            check('partentId').optional().isString().withMessage('Parent Id must be string.').escape(),
        ]
    },
    detailsRules: ()=>{
        return [
            check('id', 'ID is required.').notEmpty().isString().escape()
        ]
    },
    updateRules: () => {
        return [
            check('id', 'ID is required.').notEmpty().isString().escape(),
            check('name', 'Name is required.').notEmpty().isString().escape()
        ]
    },
    deleteRules: () => {
        return [
            check('id', 'ID is required.').notEmpty().isString().escape()
        ]
    }
}
