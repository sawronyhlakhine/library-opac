const AuthService = require('../services/auth.service');
const authService = new AuthService();
const formatResponse = require('../utils/formatResponse.util');

const register = (req, res, next) => {
    authService
        .register(req)
        .then(response => formatResponse.api(res, 0, 'Admin Register Successful.', true, response))
        .catch(err => next(err));
}
const login = (req, res, next) => {
    authService
        .login(req)
        .then(response => formatResponse.api(res, 0, 'Login successful.', true, response))
        .catch(err => next(err));
}
const logOut = (req, res, next) => {
    authService
        .logout(req)
        .then(response => formatResponse.api(res, 0, 'Logout successful.', true, response))
        .catch(err => next(err));
}


module.exports = {
    login,
    register,
    logOut
}