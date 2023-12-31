const { db } = require('../utils/db-mongo.util');
const ErrorResponse = require("../utils/errorResponse.util");
const httpConfig = require("../configs/http.config");
const { PAGE_LIMIT } = require('../configs/app.config');
const comfun = require('../utils/common.util');
const moment = require('moment');

let self;
function BookService(){
    self = this;
}

BookService.prototype = {
    getAll: (req) => {
        return new Promise(async (resolve, reject) => {
            let query = req.query,
                page = query?.page || 1,
                bookOption = {},
                pageOption = {
                    // projection: { name: 1 },
                    populate: 'author_id',
                    page: parseInt(page),
                    limit: PAGE_LIMIT,
                    sort: '-updated_at'
                };

            if (!comfun.isEmptyString(query.title)) 
                bookOption.title = { $regex: `.*${query.title}.*`};

            if (!comfun.isEmptyString(query.author_id)) 
                bookOption.author_id = query.author_id;

            let bookIdsFilter = [];
            if (!comfun.isEmptyString(query.category_id))
            {
                let bookCategoriesFilter = await db.BookCategory.find({category_id: query.category_id});
                bookIdsFilter = await bookCategoriesFilter.map(bookCategory => bookCategory.book_id);
            }

            if (!comfun.isEmptyString(query.id))
                bookIdsFilter.push(query.id)

            if(!comfun.isEmptyArray(bookIdsFilter))
                bookOption._id = { $in: bookIdsFilter }

            console.log(bookOption);
            let resultObject = {
                books: [],
                paging: {
                    currentPage: 1,
                    totalPages: 1,
                    hasPrevPage: false,
                    hasNextPage: false,
                    prevPage: null,
                    nextPage: null
                },
                filters: {
                    id: query.id || null,
                    title: query.title || null,
                    author_id: query.author_id || null,
                    category_id: query.category_id || null
                }
            };

            try {
                if ((!comfun.isEmptyString(query.category_id) && !comfun.isEmptyArray(bookIdsFilter)) || (!comfun.isEmptyString(query.id) && comfun.isEmptyString(query.category_id)))
                {
                    let bookPaging = await db.Book.paginate(bookOption, pageOption),
                        rawBooks = bookPaging.docs,
                        books = [];
        
                    for (let i = 0; i < rawBooks.length; i++) 
                    {
                        const book = rawBooks[i];
                        let rawBookCategories = await db.BookCategory.find({book_id: book._id}).populate('category_id'),
                            bookCopies = await db.BookCopy.count({book_id: book._id}),
                            availableBookCopies = await db.BookCopy.count({book_id: book._id, is_available: true}),
                            bookCategories = await rawBookCategories.map(book => {
                                return { 
                                    _id: book.category_id?._id,
                                    name: book.category_id?.name 
                                } 
                            });
        
                        books.push({
                            _id: book._id,
                            title: book.title,
                            subtitle: book.title,
                            isbn: book.isbn,
                            author: book.author_id ? { _id: book.author_id._id, name: book.author_id.name } : null,
                            categories: bookCategories,
                            publisher: book.publisher,
                            copies: bookCopies,
                            available_copies: availableBookCopies,
                            created_at: book.created_at,
                            updated_at: book.updated_at
                        });
                    }
                    resultObject.books = books;
                    resultObject.paging = {
                        currentPage: bookPaging?.page,
                        totalPages: bookPaging?.totalPages,
                        hasPrevPage: bookPaging?.hasPrevPage,
                        hasNextPage: bookPaging?.hasNextPage,
                        prevPage: bookPaging?.prevPage,
                        nextPage: bookPaging?.nextPage
                    }
                }
                resolve(resultObject);
            }
            catch (e) {
                reject(new ErrorResponse(e.message || "Unknown Error", 500, httpConfig.server_error))
            }
        })
    },
    getDetails: (req) => {
        return new Promise(async (resolve, reject) => {
            let params = req.params,
                bookId = params?.id || "";

            try {
                let book = await db.Book.findOne({_id: bookId}).populate('author_id'),
                    rawBookCopies = await db.BookCopy.find({book_id: bookId}),
                    rawBookCategories = await db.BookCategory.find({book_id: bookId}).populate('category_id'),
                    bookCategories = await rawBookCategories.map(book => {
                        return { 
                            _id: book.category_id?._id,
                            name: book.category_id?.name 
                        } 
                    }),
                    bookCopies = rawBookCopies.map(copy => { 
                        return {
                            _id: copy._id,
                            book_code: copy.book_code,
                            is_available: copy.is_available,
                            price_per_day: copy.price_per_day 
                        }
                    })

                console.log(bookCategories);
                if (book)
                {
                    resolve({
                        _id: book._id,
                        title: book.title,
                        subtitle: book.title,
                        isbn: book.isbn,
                        author: book.author_id ? { _id: book.author_id._id, name: book.author_id.name } : null,
                        categories: bookCategories,
                        edition: book.edition,
                        publisher: book.publisher,
                        published_year: book.published_year,
                        published_address: book.published_address,
                        summary: book.summary,
                        copies: bookCopies,
                        created_at: book.created_at,
                        updated_at: book.updated_at
                    })
                } 
                reject(new ErrorResponse("Book Record was not found", 404, httpConfig.not_found));
            }
            catch (e) {
                reject(new ErrorResponse(e.message || "Cannot find book record with provided ID.", 500, httpConfig.server_error))
            }
        })
    },
    store: (req) => {
        return new Promise(async (resolve, reject) => {
            let body = req.body;
                book = await db.Book.findOne({title: body.title});
            
            if (!book)
            {
                try {
                    let newBook = await db.Book.create({ 
                        title: body.title,
                        subtitle: body.subtitle,
                        isbn: body.isbn,
                        author_id: body.author_id,
                        edition: body.edition,
                        publisher: body.publisher,
                        published_year: body.published_year,
                        published_address: body.published_address,
                        summary: body.summary,
                        status: true
                    });
                    let newCopy = await db.BookCopy.create({
                        book_id: newBook._id,
                        book_code: comfun.generateRandomCode(6),
                        is_available: true,
                        is_copy: false,
                        price_per_day: 175
                    });
                    let categories = body.category_id || [];
                    for (let i=0; i < categories.length; i++)
                    {
                        let tempCategory = await db.BookCategory.create({
                            book_id: newBook._id,
                            category_id: categories[i]
                        })
                    }
                    resolve({ _id: newBook._id });
                }
                catch (e)
                {
                    reject(new ErrorResponse(e.message || "Unknow Error.", 500, httpConfig.server_error))
                }
            }

            reject(new ErrorResponse("Book was already exist.", 400, httpConfig.already_exist));
        })
    },
    update: (req) => {
        return new Promise(async (resolve, reject) => {
            let body = req.body,
                params = req.params;
            
            try {

                let book = await db.Book.findOne({_id: params.id});
                if (book)
                {
                    let updateBook = await db.Book.findOneAndUpdate({_id: params.id }, { 
                        title: body.title,
                        subtitle: body.subtitle,
                        isbn: body.isbn,
                        author_id: body.author_id,
                        edition: body.edition,
                        publisher: body.publisher,
                        published_year: body.published_year,
                        published_address: body.published_address,
                        summary: body.summary,
                    });
                    let bookCopy = await db.BookCopy.findOneAndUpdate({book_id: updateBook._id, is_copy: false}, { price_per_day: body.price_per_day });
                    await db.BookCategory.deleteMany({book_id: updateBook._id});
                    let categories = body.category_id || [];
                    for (let i=0; i < categories.length; i++)
                    {
                        let tempCategory = await db.BookCategory.create({
                            book_id: updateBook._id,
                            category_id: categories[i]
                        })
                    }
                    resolve({ _id: updateBook._id });
                } 
                reject(new ErrorResponse("Book was not found", 404, httpConfig.not_found));
            }
            catch (e) {
                reject(new ErrorResponse(e.message || "Cannot find book with provided ID.", 500, httpConfig.server_error))
            }
        })
    },
    remove: (req) => {
        return new Promise(async (resolve, reject) => {

            let params = req.params;
            try {

                let book = await db.Book.findOne({_id: params.id});
                if (!book) return reject(new ErrorResponse("Book was not found.", 400, httpConfig.not_found));

                let copies = await db.BookCopy.find({book_id: params.id}),
                    copyIds = [];

                copyIds = await copies.map(copy => copy._id)

                let borrowedBooks = await db.BookRent.find({copy_id: { $in: copyIds }});
                if (borrowedBooks && borrowedBooks.length > 0)
                {
                    reject(new ErrorResponse("Book cannot delete due to related with borrowed books.", 301, httpConfig.not_allow));
                } 
                else 
                {
                    await db.BookCategory.deleteMany({book_id: params.id });
                    await db.BookCopy.deleteMany({book_id: params.id });
                    await db.Book.deleteOne({_id: params.id });
                    resolve(true);
                }
            
            }
            catch (e) {
                reject(new ErrorResponse(e.message || "Cannot find book with provided ID.", 500, httpConfig.server_error))
            }
        })
    },
    addCopy: (req) => {
        return new Promise(async (resolve, reject) => {
            let body = req.body,
                params = req.params;

            try {
                let book = await db.Book.findOne({_id: params.id});
                if (!book) return reject(new ErrorResponse("Book was not found.", 400, httpConfig.not_found));

                let newCopy = await db.BookCopy.create({
                    book_id: book._id,
                    book_code: comfun.generateRandomCode(6),
                    is_available: true,
                    is_copy: true,
                    price_per_day: body.price_per_day
                });
                resolve({
                    _id: newCopy._id,
                    book_code: newCopy.book_code
                })
            }
            catch (e) {
                reject(new ErrorResponse(e.message || "Cannot find book with provided ID.", 500, httpConfig.server_error))
            }
        });
    },
    returnBook: (req) => {
        return new Promise(async (resolve, reject) => {
            let body = req.body,
                params = req.params;

            try {
                let book = await db.Book.findOne({_id: params.id});
                if (!book) return reject(new ErrorResponse("Book was not found.", 400, httpConfig.not_found));

                let bookCopy = await db.BookCopy.findOneAndUpdate({ book_id: book._id, book_code: body.book_code }, { is_available: true,});
                let bookRent = await db.BookRent.findOne({ copy_id: bookCopy._id});
                // console.log(bookRent);
                if (bookRent)
                {
                    let startDate = moment(bookRent.start_date),
                        endDate = moment(),
                        dayDifferents = endDate.diff(startDate, 'days');
    
                    bookRent.end_at = endDate;
                    bookRent.rent_days = Math.ceil(dayDifferents);
                    bookRent.amounts = parseInt(bookCopy.price_per_day) *  Math.ceil(dayDifferents);
                    bookRent.save();
                }              

                resolve({
                    _id: book._id,
                    book_code: bookCopy.book_code,
                    is_available: bookCopy.is_available
                })
            }
            catch (e) {
                reject(new ErrorResponse(e.message || "Cannot find book with provided ID.", 500, httpConfig.server_error))
            }
        });
    }
}

module.exports = BookService;