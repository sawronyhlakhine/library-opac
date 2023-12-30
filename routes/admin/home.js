let express = require('express');
let router = express.Router();
let asyncHandler = require('../../middlewares/asyncHandler.middleware');
let dirs = __dirname.split("/");

const PREFIX = '/' + dirs[dirs.length-1];

router.get(PREFIX + '/', function(req, res, next) {
  res.render('index', { title: 'API' });
});
router.get(PREFIX + '/home', asyncHandler(function(req, res, next) {
    res.render('index', { title: 'API Home' });
}));

module.exports = router;
