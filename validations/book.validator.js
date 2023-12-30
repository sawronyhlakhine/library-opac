const { check } = require('express-validator');

/** 
 * SEE DOCS VIA BELOW LINK
 * https://express-validator.github.io/docs/index.html
 * https://flaviocopes.com/express-validate-input/
 * 
*/
module.exports = {
    listRules: ()=> {
        return [
            check('title').optional().isString().withMessage('Title must be string').escape(),
            check('author_id')
                .optional()
                .isString().withMessage('Author ID must be string')
                .isLength({min: 24}).withMessage('Author ID must have minimun 24 characters.')
                .escape(),
            check('category_id')
                .optional()
                .isString().withMessage('Category ID must be string')
                .isLength({min: 24}).withMessage('Category ID must have minimun 24 characters.')
                .escape(),
            check('id').optional().isString().withMessage('ID must be string').escape()
        ]
    },
    createRules: ()=>{
        return [
            check('title', 'Title is required.').isLength({min: 10}).notEmpty().isString().escape(),
            check('subtitle', 'Subtitle is required.').notEmpty().isString().escape(),
            check('isbn', 'ISBN is required.').isAlphanumeric().withMessage("ISBN must be number string.").notEmpty().isString().escape(),
            check('author_id', 'Author ID is required.').notEmpty().isString().escape(),
            check('category_id').optional().isArray().withMessage('Categories must be array').escape(),
            check('edition', 'Edition is required.').notEmpty().isNumeric().escape(),
            check('publisher').optional().isString().withMessage("Publisher must be string").escape(),
            check('published_year').optional().isNumeric().withMessage("Publisher must be string").escape(),
            check('published_address').optional().isString().withMessage("Publisher must be string").escape(),
            check('summary').optional().isString().withMessage("Summary must be string").escape(),

            check('price_per_day', "Price Per Day is require").notEmpty().isNumeric().escape(),
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
            check('title', 'Title is required.').isLength({min: 10}).notEmpty().isString().escape(),
            check('subtitle', 'Subtitle is required.').notEmpty().isString().escape(),
            check('isbn', 'ISBN is required.').isAlphanumeric().withMessage("ISBN must be number string.").notEmpty().isString().escape(),
            check('author_id', 'Author ID is required.').notEmpty().isString().escape(),
            check('category_id').optional().isArray().withMessage('Categories must be array').escape(),
            check('edition', 'Edition is required.').notEmpty().isNumeric().escape(),
            check('publisher').optional().isString().withMessage("Publisher must be string").escape(),
            check('published_year').optional().isNumeric().withMessage("Publisher must be string").escape(),
            check('published_address').optional().isString().withMessage("Publisher must be string").escape(),
            check('summary').optional().isString().withMessage("Summary must be string").escape(),
            check('price_per_day', "Price Per Day is require").notEmpty().isNumeric().escape(),
        ]
    },
    deleteRules: () => {
        return [
            check('id', 'ID is required.').notEmpty().isString().escape()
        ]
    },
    addCopyRules: () => {
        return [
            check('price_per_day', "Price Per Day is require").notEmpty().isNumeric().escape()
        ]
    },
    returnRules: () => {
        return [
            check('book_code', "Book Code is require").notEmpty().isString().escape()
        ]
    }
}