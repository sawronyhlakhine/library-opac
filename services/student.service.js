const { db } = require('../utils/db-mongo.util');
const ErrorResponse = require("../utils/errorResponse.util");
const httpConfig = require("../configs/http.config");
const { PAGE_LIMIT } = require('../configs/app.config');

let self;
function StudentService(){
    self = this;
}

StudentService.prototype = {
    getAll: (req) => {
        return new Promise(async (resolve, reject) => {
            let query = req.query,
                page = query?.page || 1,
                pageOption = {
                    // projection: { name: 1 },
                    page: parseInt(page),
                    limit: PAGE_LIMIT,
                    sort: '-updated_at'
                };
            // let student =  await db.Student.aggregate([
            //     { $match: {_id: studentId} },
            //     {
            //         $project: {
            //             _id: '$_id',
            //             name: '$name',
            //             phone: '$phone',
            //             email: '$email'
            //         }
            //     },
            //     {
            //         $sort: {_id: 1}
            //     }
            // ]);
            let studentsPaging = await db.Student.paginate({}, pageOption);
            resolve({
                students: studentsPaging.docs,
                paging: {
                    currentPage: studentsPaging?.page,
                    totalPages: studentsPaging?.totalPages,
                    hasPrevPage: studentsPaging?.hasPrevPage,
                    hasNextPage: studentsPaging?.hasNextPage,
                    prevPage: studentsPaging?.prevPage,
                    nextPage: studentsPaging?.nextPage
                }
            });
        })
    },
    getDetails: (req) => {
        return new Promise(async (resolve, reject) => {
            let params = req.params,
                studentId = params?.id || "";

            try {
                let student = await db.Student.findOne({_id: studentId}, {__v: 0});
                if (student) resolve(student);
                reject(new ErrorResponse("Student was not found", 404, httpConfig.not_found));
            }
            catch (e) {
                reject(new ErrorResponse(e.message || "Cannot find student with provided ID.", 500, httpConfig.server_error))
            }
        })
    },
    borrowedBooks: (req) => {
        return new Promise(async (resolve, reject) => {
            let params = req.params;

            try {
                let student = await db.Student.findOne({_id: params.id}, {__v: 0});
                if (student) 
                {
                    let borrowedBooks = await db.BookRent.find({student_id: student._id}, {copy_id: 1 }),
                        copyIds = [],
                        resultData = [];

                    copyIds = await borrowedBooks.map(borrowBook => borrowBook.copy_id);
                    
                    let bookCopies = await db.BookCopy.find({ _id: { $in: copyIds }}).populate('book_id');
                    for (let i=0; i < bookCopies.length; i++)
                    {
                        const bookCopy = bookCopies[i];
                        if (bookCopy.book_id)
                            resultData.push({
                                _id: bookCopy.book_id._id,
                                title: bookCopy.book_id.title,
                                isbn: bookCopy.book_id.isbn,
                                is_copy: bookCopy.is_copy,
                                end_at: bookCopy.end_at,
                                amount: bookCopy.amount,
                            })
                    }
                    resolve({ 
                        _id: student._id,
                        student_name: student.name,
                        borrowed_books: resultData
                    });
                }
                reject(new ErrorResponse("Student was not found", 404, httpConfig.not_found));
            }
            catch (e) {
                reject(new ErrorResponse(e.message || "Cannot find student with provided ID.", 500, httpConfig.server_error))
            }


            reject(new ErrorResponse("Student was not found.", 404, httpConfig.not_found));
        })
    }
}

module.exports = StudentService;