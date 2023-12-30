const AuthorService = require('../services/author.service');
const authorService = new AuthorService();
const formatResponse = require('../utils/formatResponse.util');

const getAll = (req, res, next) => {
    authorService
        .getAll(req)
        .then(response => formatResponse.api(res, 0, 'Retrieve Authors Successful.', true, response))
        .catch(err => next(err));
}
const getDetails = (req, res, next) => {
    authorService
        .getDetails(req)
        .then(response => formatResponse.api(res, 0, 'Retrieve Author Details successful.', true, response))
        .catch(err => next(err));
}
const store = (req, res, next) => {
    authorService
        .store(req)
        .then(response => formatResponse.api(res, 0, 'Author Store successful.', true, response))
        .catch(err => next(err));
}
const update = (req, res, next) => {
    authorService
        .update(req)
        .then(response => formatResponse.api(res, 0, 'Author Updated successful.', true, response))
        .catch(err => next(err));
}
const remove = (req, res, next) => {
    authorService
        .remove(req)
        .then(response => formatResponse.api(res, 0, 'Author Remove successful.', true, response))
        .catch(err => next(err));
}


module.exports = {
    getAll,
    getDetails,
    store,
    update,
    remove
}