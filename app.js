require('dotenv').config();

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');

const appConfig = require('./configs/app.config');

// custom utils
var { routeModules } = require('./routes');
var { cors } = require('./utils/cors.util');
var { notFound, errorHandler } = require('./middlewares/errorHandler.middleware');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session(appConfig.SESSION_COOKIE));

// CORS
app.use(cors);

// ROUTE MODULES
app.use(routeModules);

app.use(notFound, errorHandler);

module.exports = app;
