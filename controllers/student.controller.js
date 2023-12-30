const StudentService = require('../services/student.service');
const studentService = new StudentService();
const formatResponse = require('../utils/formatResponse.util');

const getAll = (req, res, next) => {
    studentService
        .getAll(req)
        .then(response => formatResponse.api(res, 0, 'Retrieve Students Successful.', true, response))
        .catch(err => next(err));
}
const getDetails = (req, res, next) => {
    studentService
        .getDetails(req)
        .then(response => formatResponse.api(res, 0, 'Retrieve Student Details successful.', true, response))
        .catch(err => next(err));
}
const borrowedBooks = (req, res, next) => {
    studentService
        .borrowedBooks(req)
        .then(response => formatResponse.api(res, 0, 'Retrieve Student Borrowed Books Successful', true, response))
        .catch(err => next(err));
}

module.exports = {
    getAll,
    getDetails,
    borrowedBooks
}