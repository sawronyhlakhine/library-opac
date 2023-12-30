const { db } = require('../utils/db-mongo.util');
const ErrorResponse = require("../utils/errorResponse.util");
const httpConfig = require("../configs/http.config");

let self;
function BookService(){
    self = this;
}

BookService.prototype = {
    getAll: (req) => {
        return new Promise(async (resolve, reject) => {
            resolve(1);
        })
    },
    getDetails: (req) => {
        return new Promise(async (resolve, reject) => {
            resolve(1);
        })
    },
    store: (req) => {
        return new Promise(async (resolve, reject) => {
            resolve(1);
        })
    },
    update: (req) => {
        return new Promise(async (resolve, reject) => {
            resolve(1);
        })
    },
    remove: (req) => {
        return new Promise(async (resolve, reject) => {
            resolve(1);
        })
    }
}

module.exports = BookService;