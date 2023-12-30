const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookCategorySchema = new Schema(
    {
        book_id:  {
            type: Schema.Types.ObjectId,
            ref: "books",
        },
        category_id:  {
            type: Schema.Types.ObjectId,
            ref: "categories",
        }
    },
    {
        timestamps: false
    }
);

let BookCategory = mongoose.model("book_categories", BookCategorySchema);
module.exports = BookCategory;