var express = require('express');
var router = express.Router();
const PREFIX = '/api/v1';
var asyncHandler = require('../middlewares/asyncHandler.middleware');
var authMiddleware = require('../middlewares/auth.middleware');

router.get(PREFIX + '/checkService', (req, res, next) => {
    res.status(200).json({
        statusCode: 0,
        isSuccess: true,
        message: "Success",
        data: [ "APIs are working..." ],
        error: null
    });
});

router.get(PREFIX + '/home', authMiddleware.protect ,asyncHandler(function(req, res, next) {
    res.render('index', { title: 'API Home' });
}));

// res.send('respond with a resource');
router.get(PREFIX + '/users', function(req, res, next) {
    const t0 = performance.now();
    res.render('index', { title: 'API Home' });
    const t1 = performance.now();
    console.log(`Took ${Math.round(t1 - t0)} milliseconds.`);
});
module.exports = router;
