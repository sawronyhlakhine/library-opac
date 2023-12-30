const { db } = require('../utils/db-mongo.util');
const ErrorResponse = require("../utils/errorResponse.util");
const httpConfig = require("../configs/http.config");
const { PAGE_LIMIT } = require('../configs/app.config');

let self;
function AuthorService(){
    self = this;
}

AuthorService.prototype = {
    getAll: (req) => {
        return new Promise(async (resolve, reject) => {
            let query = req.query,
                page = query?.page || 1,
                pageOption = {
                    projection: { name: 1 },
                    page: parseInt(page),
                    limit: PAGE_LIMIT,
                    sort: '-updated_at'
                };
            // let authors = await db.Author.aggregate([
            //     { $match: { name: { $regex: `.*${query.keyword}.*`} } },
            //     {
            //         $project: {
            //             _id: '$_id',
            //             name: '$name',
            //         }
            //     },
            //     {
            //         $sort: {_id: 1}
            //     }
            // ]);
            let authorsPaging = await db.Author.paginate({}, pageOption);
            resolve({
                authors: authorsPaging.docs,
                paging: {
                    currentPage: authorsPaging?.page,
                    totalPages: authorsPaging?.totalPages,
                    hasPrevPage: authorsPaging?.hasPrevPage,
                    hasNextPage: authorsPaging?.hasNextPage,
                    prevPage: authorsPaging?.prevPage,
                    nextPage: authorsPaging?.nextPage
                }
            });
        })
    },
    getDetails: (req) => {
        return new Promise(async (resolve, reject) => {
            let params = req.params,
                authorId = params?.id || "";

            try {
                let author = await db.Author.findOne({_id: authorId}, { __v: 0});
                if (author) resolve(author)
                reject(new ErrorResponse("Author was not found", 404, httpConfig.not_found));
            }
            catch (e) {
                reject(new ErrorResponse(e.message || "Cannot find author with provided ID.", 500, httpConfig.server_error))
            }
        })
    },
    store: (req) => {
        return new Promise(async (resolve, reject) => {
            let body = req.body,
                author = await db.Author.findOne({name: body.name});

            if (!author)
            {
                let newAuthor = await db.Author.create({ name: body.name });
                resolve({ _id: newAuthor._id });
            } 
            reject(new ErrorResponse("Author was already exist.", 400, httpConfig.already_exist));
        })
    },
    update: (req) => {
        return new Promise(async (resolve, reject) => {
            let body = req.body,
                params = req.params;
            
            try {

                let author = await db.Author.findOne({name: body.name});
                if (!author)
                {
                    let newAuthor = await db.Author.findOneAndUpdate({_id: params.id }, { name: body.name });
                    resolve({ _id: newAuthor._id });
                } 
                reject(new ErrorResponse("Author name was already exist.", 400, httpConfig.already_exist));
            }
            catch (e) {
                reject(new ErrorResponse(e.message || "Cannot find author with provided ID.", 500, httpConfig.server_error))
            }
        })
    },
    remove: (req) => {
        return new Promise(async (resolve, reject) => {

            let params = req.params;
            try {

                let author = await db.Author.findOne({_id: params.id});
                if (!author) return reject(new ErrorResponse("Author was not found.", 400, httpConfig.not_found));

                let books = await db.Book.find({author_id: params.id});
                if (books && books.length > 0)
                {
                    reject(new ErrorResponse("Author cannot delete due to related with books.", 301, httpConfig.not_allow));
                }
                else 
                    await db.Author.deleteOne({_id: params.id });
                resolve(true);
            
            }
            catch (e) {
                reject(new ErrorResponse(e.message || "Cannot find author with provided ID.", 500, httpConfig.server_error))
            }
        })
    }
}

module.exports = AuthorService;