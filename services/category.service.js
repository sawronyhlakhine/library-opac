const { db } = require('../utils/db-mongo.util');
const ErrorResponse = require("../utils/errorResponse.util");
const httpConfig = require("../configs/http.config");
const { PAGE_LIMIT } = require('../configs/app.config');

let self;
function CategoryService(){
    self = this;
}

CategoryService.prototype = {
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

            let categoriesPaging = await db.Category.paginate({}, pageOption);
            resolve({
                categories: categoriesPaging.docs,
                paging: {
                    currentPage: categoriesPaging?.page,
                    totalPages: categoriesPaging?.totalPages,
                    hasPrevPage: categoriesPaging?.hasPrevPage,
                    hasNextPage: categoriesPaging?.hasNextPage,
                    prevPage: categoriesPaging?.prevPage,
                    nextPage: categoriesPaging?.nextPage
                }
            });
        })
    },
    getDetails: (req) => {
        return new Promise(async (resolve, reject) => {
            let params = req.params,
                categoryId = params?.id || "";

            try {
                let category = await db.Category.findOne({_id: categoryId}, {__v: 0}).populate('parent_id');
                if (category)
                {
                    resolve({
                        _id: category._id,
                        name: category.name,
                        parent: category.parent_id ? { _id: category.parent_id._id, name: category.parent_id.name } : null,
                        created_at: category.created_at,
                        updated_at: category.updated_at
                    })
                } 
                reject(new ErrorResponse("Category was not found", 404, httpConfig.not_found));
            }
            catch (e) {
                reject(new ErrorResponse(e.message || "Cannot find category with provided ID.", 500, httpConfig.server_error))
            }
        })
    },
    store: (req) => {
        return new Promise(async (resolve, reject) => {
            let body = req.body,
                category = await db.Category.findOne({name: body.name});

            if (!category)
            {
                let newCategory = await db.Category.create({ 
                    name: body.name,
                    parent_id: body.parent_id || null
                });
                resolve({ _id: newCategory._id });
            } 
            reject(new ErrorResponse("Category was already exist.", 400, httpConfig.already_exist));
        })
    },
    update: (req) => {
        return new Promise(async (resolve, reject) => {
            let body = req.body,
                params = req.params;
            
            try {

                let category = await db.Category.findOne({name: body.name});
                if (!category)
                {
                    let newCategory = await db.Category.findOneAndUpdate({_id: params.id }, { name: body.name, parent_id: body.parent_id || null });
                    resolve({ _id: newCategory._id });
                } 
                reject(new ErrorResponse("Category name was already exist.", 400, httpConfig.already_exist));
            }
            catch (e) {
                reject(new ErrorResponse(e.message || "Cannot find category with provided ID.", 500, httpConfig.server_error))
            }
        })
    },
    remove: (req) => {
        return new Promise(async (resolve, reject) => {

            let params = req.params;
            try {

                let category = await db.Category.findOne({_id: params.id});
                if (!category) return reject(new ErrorResponse("Category was not found.", 400, httpConfig.not_found));

                let books = await db.BookCategory.find({category_id: params.id});
                if (books && books.length > 0)
                {
                    reject(new ErrorResponse("Category cannot delete due to related with books.", 301, httpConfig.not_allow));
                }
                else 
                    await db.Category.deleteOne({_id: params.id });
                resolve(true);
            
            }
            catch (e) {
                reject(new ErrorResponse(e.message || "Cannot find author with provided ID.", 500, httpConfig.server_error))
            }
        })
    }
}

module.exports = CategoryService;