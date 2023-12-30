const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const BookSchema = new Schema(
    {
        title: {
            type: Schema.Types.String,
            required: true,
        },
        subtitle: {
            type: Schema.Types.String,
            required: true,
        },
        isbn: {
            type: Schema.Types.String,
            required: true,
        },
        author_id: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "authors"
        },
        edition: {
            type: Schema.Types.Number,
            default: 1
        },
        publisher: {
            type: Schema.Types.String,
            default: null
        },
        published_year: {
            type: Schema.Types.Number,
            default: null
        },
        published_address: {
            type: Schema.Types.String,
            default: null
        },
        summary: {
            type: Schema.Types.String,
            default: null
        },
        status: {
            type: Schema.Types.Boolean,
            default: 1
        }
    },
    {
        timestamps:  { 
            createdAt: "created_at",
            updatedAt: "updated_at"
        }
    }
);
BookSchema.plugin(mongoosePaginate)
let Book = mongoose.model("books", BookSchema);
module.exports = Book;