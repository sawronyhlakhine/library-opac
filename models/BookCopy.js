const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookCopySchema = new Schema(
    {
        book_id: {
            type: Schema.Types.ObjectId,
            ref: "books",
        },
        book_code: {
            type: Schema.Types.String,
            required: true
        },
        is_available: {
            type: Schema.Types.Boolean,
            default: true 
        },
        is_copy: {
            type: Schema.Types.Boolean,
            default: true 
        },
        price_per_day: {
            type: Schema.Types.Number,
            default: 0
        }
    },
    {
        timestamps:  { 
            createdAt: "created_at",
            updatedAt: "updated_at"
        }
    }
);

let BookCopy = mongoose.model("book_copies", BookCopySchema);
module.exports = BookCopy;