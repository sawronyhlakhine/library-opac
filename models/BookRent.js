const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookRentSchema = new Schema(
    {
        book_code: {
            type: Schema.Types.String,
            required: true
        },
        book_id: {
            type: Schema.Types.ObjectId,
            ref: "books",
        },
        user_id: {
            type: Schema.Types.ObjectId,
            ref: "users",
        },
        rent_days: {
            type: Schema.Types.Number,
            default: 0
        },
        start_at: {
            type: Schema.Types.Date
        },
        end_at: {
            type: Schema.Types.Date
        },
        amount: {
            type: Schema.Types.Number
        }
    },
    {
        timestamps:  { 
            createdAt: "created_at",
            updatedAt: "updated_at"
        }
    }
);

let BookRent = mongoose.model("book_rents", BookRentSchema);
module.exports = BookRent;