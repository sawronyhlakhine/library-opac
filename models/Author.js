const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const AuthorSchema = new Schema(
    {
        name: {
            type: Schema.Types.String,
            required: true,
            defaults: null
        }
    },
    {
        timestamps:  { 
            createdAt: "created_at",
            updatedAt: "updated_at"
        }
    }
);

AuthorSchema.plugin(mongoosePaginate);
let Author = mongoose.model("authors", AuthorSchema);
module.exports = Author;