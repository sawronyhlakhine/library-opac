let express = require('express');
let router = express.Router();
const PREFIX = '/api/v1';

let asyncHandler = require('../middlewares/asyncHandler.middleware');
let authMiddleware = require('../middlewares/auth.middleware');
let rateLimitMiddleware = require('../middlewares/rateLimit.middleware');

let validator = require('../validations/index.validator'),
    authorValidator = require('../validations/author.validator'),
    categoryValidator = require('../validations/category.validator'),
    studentValidator = require('../validations/student.validator');

let authorController = require('./../controllers/author.controller'),
    categoryController = require('../controllers/category.controller'),
    studentController = require('../controllers/student.controller')

let commonMiddlewares = [
    validator.validate,
    authMiddleware.protect,
    rateLimitMiddleware.rateLimit
];

router.get(PREFIX + '/checkService', (req, res, next) => {
    res.status(200).json({
        statusCode: 0,
        isSuccess: true,
        message: "Success",
        data: [ "APIs are working..." ],
        error: null
    });
});

// -----------------------------
// AUTHOR ACCESS
// -----------------------------
router.get( PREFIX + '/author', commonMiddlewares, authorController.getAll);
router.get( PREFIX + '/author/:id', authorValidator.detailsRules(), commonMiddlewares, authorController.getDetails);
router.post( PREFIX + '/author', authorValidator.createRules(), commonMiddlewares, authorController.store);
router.put( PREFIX + '/author/:id', authorValidator.updateRules(), commonMiddlewares, authorController.update);
router.delete( PREFIX + '/author/:id', authorValidator.deleteRules(), commonMiddlewares, authorController.remove);

// -----------------------------
// CATEGORY ACCESS
// -----------------------------
router.get( PREFIX + '/category', commonMiddlewares, categoryController.getAll);
router.get( PREFIX + '/category/:id', categoryValidator.detailsRules(), commonMiddlewares, categoryController.getDetails);
router.post( PREFIX + '/category', categoryValidator.createRules(), commonMiddlewares, categoryController.store);
router.put( PREFIX + '/category/:id', categoryValidator.updateRules(), commonMiddlewares, categoryController.update);
router.delete( PREFIX + '/category/:id', categoryValidator.deleteRules(), commonMiddlewares, categoryController.remove);

// -----------------------------
// BOOK ACCESS
// -----------------------------
router.get( PREFIX + '/book', commonMiddlewares, categoryController.getAll);
router.get( PREFIX + '/book/:id', categoryValidator.detailsRules(), commonMiddlewares, categoryController.getDetails);
router.post( PREFIX + '/book', categoryValidator.createRules(), commonMiddlewares, categoryController.store);
router.put( PREFIX + '/book/:id', categoryValidator.updateRules(), commonMiddlewares, categoryController.update);
router.delete( PREFIX + '/book/:id', categoryValidator.deleteRules(), commonMiddlewares, categoryController.remove);

router.put( PREFIX + '/book/:id/return', categoryValidator.updateRules(), commonMiddlewares, categoryController.update);
router.post( PREFIX + '/book/:id/add-copy', categoryValidator.updateRules(), commonMiddlewares, categoryController.update);

// -----------------------------
// STUDENT ACCESS
// -----------------------------
router.get( PREFIX + '/student', commonMiddlewares, studentController.getAll);
router.get( PREFIX + '/student/:id', studentValidator.detailsRules(), commonMiddlewares, studentController.getDetails);
router.get( PREFIX + '/student/:id/borrowed-book', studentValidator.detailsRules(), commonMiddlewares, studentController.borrowedBooks);

module.exports = router;
