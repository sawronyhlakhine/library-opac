require('dotenv').config();

module.exports = {
    APP_NAME: process.env.APP_NAME || "LIBRARY OPAC",
    APP_URL: process.env.APP_URL || "http://localhost/",
    VERSION: "0.0.0",
    PORT: process.env.PORT || 3000,
    DEBUG: true,
    JWT: {
        SECRET_KEY : '5dp2U-MWD+HfjWv8&kKJb&ZA&xUq!4pT3-aH&kcxFwCWd%5jAFTUY5MjD5JG!X%A',
        EXPIRED_AT : process.env.JWT_TOKEN_EXPIRED || '24h',  // 60 * 60,
        ISSUER: process.env.APP_URL || "http://localhost/",
        TOKEN_NAME: process.env.JWT_TOKEN_NAME || "Json Web Token"
    },
    SESSION_COOKIE: { 
        secret: process.env.COOKIE_SECRET || "secret",
        resave: true,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24
        }
    },
    RATE_LIMIT: {
        WINDOW_MS: 60000, // 1 Minute = 60000
        MAX_WINDOW_REQUEST_COUNT: 60,
        HTTP_STATUS_CODE: 200
    },
    PAGE_LIMIT: 10,
}