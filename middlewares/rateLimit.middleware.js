const rateLimiter = require('express-rate-limit');
const { too_many_request } = require('../configs/http.config');
const { RATE_LIMIT } = require('../configs/app.config');

exports.rateLimit = rateLimiter({
	windowMs: RATE_LIMIT.WINDOW_MS, 
	max: RATE_LIMIT.MAX_WINDOW_REQUEST_COUNT || 0,
	statusCode: RATE_LIMIT.HTTP_STATUS_CODE,
	message: {
		statusCode: too_many_request.code,
		isSuccess: !1,
		message: too_many_request.message,
		data: null,
		errors: {
			code: "429" + too_many_request.code,
			body: [`You can only make ${RATE_LIMIT.MAX_WINDOW_REQUEST_COUNT} request(s) in every minute.`]
		}
	},
	header: true
});