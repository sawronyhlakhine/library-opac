const BookService = require('../services/book.service');
const bookService = new BookService();
const formatResponse = require('../utils/formatResponse.util');

const getAll = (req, res, next) => {
    bookService
        .getAll(req)
        .then(response => formatResponse.api(res, 0, 'Retrieve Book Records Successful.', true, response))
        .catch(err => next(err));
}
const getDetails = (req, res, next) => {
    bookService
        .getDetails(req)
        .then(response => formatResponse.api(res, 0, 'Retrieve Book Record Details successful.', true, response))
        .catch(err => next(err));
}
const store = (req, res, next) => {
    bookService
        .store(req)
        .then(response => formatResponse.api(res, 0, 'Book Record Store successful.', true, response))
        .catch(err => next(err));
}
const update = (req, res, next) => {
    bookService
        .update(req)
        .then(response => formatResponse.api(res, 0, 'Book Record Updated successful.', true, response))
        .catch(err => next(err));
}
const remove = (req, res, next) => {
    bookService
        .remove(req)
        .then(response => formatResponse.api(res, 0, 'Book Record Remove successful.', true, response))
        .catch(err => next(err));
}
const addCopy = (req, res, next) => {
    bookService
        .addCopy(req)
        .then(response => formatResponse.api(res, 0, 'Book Record Copy Added successful.', true, response))
        .catch(err => next(err));
}
const returnBook = (req, res, next) => {
    bookService
        .returnBook(req)
        .then(response => formatResponse.api(res, 0, 'Book Record Updated successful.', true, response))
        .catch(err => next(err));
}


module.exports = {
    getAll,
    getDetails,
    store,
    update,
    remove,
    addCopy,
    returnBook
}