const CategoryService = require('../services/category.service');
const categoryService = new CategoryService();
const formatResponse = require('../utils/formatResponse.util');

const getAll = (req, res, next) => {
    categoryService
        .getAll(req)
        .then(response => formatResponse.api(res, 0, 'Retrieve Categories Successful.', true, response))
        .catch(err => next(err));
}
const getDetails = (req, res, next) => {
    categoryService
        .getDetails(req)
        .then(response => formatResponse.api(res, 0, 'Retrieve Category Details successful.', true, response))
        .catch(err => next(err));
}
const store = (req, res, next) => {
    categoryService
        .store(req)
        .then(response => formatResponse.api(res, 0, 'Category Store successful.', true, response))
        .catch(err => next(err));
}
const update = (req, res, next) => {
    categoryService
        .update(req)
        .then(response => formatResponse.api(res, 0, 'Category Updated successful.', true, response))
        .catch(err => next(err));
}
const remove = (req, res, next) => {
    categoryService
        .remove(req)
        .then(response => formatResponse.api(res, 0, 'Category Remove successful.', true, response))
        .catch(err => next(err));
}


module.exports = {
    getAll,
    getDetails,
    store,
    update,
    remove
}