let express = require('express');
let router = express.Router();
// let asyncHandler = require('../middlewares/asyncHandler.middleware');

const webController = require('./../controllers/web.controller');

/* GET home page. */
router.get('/', webController.home);
router.get('/details', webController.bookDetails);
router.get('/borrow-entry', webController.borrow);
router.post('/borrow-entry/:id', webController.storeBorrow);

module.exports = router;

