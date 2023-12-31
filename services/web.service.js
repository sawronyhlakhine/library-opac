const { db } = require('../utils/db-mongo.util');
const ErrorResponse = require("../utils/errorResponse.util");
const emailPattern = /^([a-zA-Z0-9._-]+)@([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,6})$/;
const {PAGE_LIMIT} = require('./../configs/app.config');
const comfun = require('./../utils/common.util');
const httpConfig = require('./../configs/http.config');

let self;
function WebService(){
    self = this;
}

WebService.prototype = {
    home: (req) => {
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

            let orOpt = [];
            if (!comfun.isEmptyString(query.title)) 
                orOpt.push({ title: { $regex: `.*${query.title}.*`}});
            
            if (!comfun.isEmptyString(query.isbn)) 
                orOpt.push({ isbn: { $regex: `.*${query.isbn}.*`}});

            if (!comfun.isEmptyArray(orOpt))
                bookOption.$or = orOpt;

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
                filterFields: {
                    title: query.title || null,
                    isbn: query.isbn || null
                }
            };

            try {
                if (!comfun.isEmptyString(query.title) || !comfun.isEmptyString(query.isbn) && comfun.isEmptyString(query.category_id))
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
        });
    },
    bookDetails: (req) => {
        return new Promise(async (resolve, reject) => {
            let query = req.query,
                bookId = query?.id || "";

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
                            is_copy: copy.is_copy,
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
    borrowEntry: (req) => {
        return new Promise(async (resolve, reject) => {
            let query = req.query;
            let bookCopy = await db.BookCopy.findOne({ book_code: query.book_code })
            if (bookCopy) 
                resolve({ book_code: query.book_code, id: bookCopy._id });
            else
                reject(new ErrorResponse("Book Record was not found", 404, httpConfig.not_found));
        })
    },
    borrowStore: (req) => {
        return new Promise(async (resolve, reject) => {
            let body = req.body,
                params = req.params;

            try {
                let student = await db.Student.findOne({email: body.email});
                if (student) 
                {
                    student.name = body.name;
                    student.phone = body.phone || null;
                    student.address = body.address || "";
                    student.save();
                }
                else 
                {
                    student = await db.Student.create({
                        name: body.name,
                        phone: body.phone || null,
                        email: body.email || 'example@gmail.com',
                        address: body.address || "",
                    })
                }

                let bookRent = await db.BookRent.create({
                    copy_id: params.id,
                    student_id: student._id,
                    start_at: new Date(),
                    end_at: null,
                    rent_days: null,
                    amount: 0
                })

                let updateCopy = await db.BookCopy.findOneAndUpdate({_id: params.id}, {is_available: false})

                resolve(true);
            }
            catch (e) {
                reject(new ErrorResponse(e.message || "Unknow Error.", 500, httpConfig.server_error))
            }
        })
    }
}

module.exports = WebService;
