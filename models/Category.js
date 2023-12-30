const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const CategorySchema = new Schema(
    {
        name: {
            type: Schema.Types.String,
            required: true,
            defaults: null
        },
        parent_id: {
            type: Schema.Types.ObjectId,
            required: false,
            ref: "categories",
        }
    },
    {
        timestamps:  { 
            createdAt: "created_at",
            updatedAt: "updated_at"
        }
    }
);

CategorySchema.plugin(mongoosePaginate);
let Category = mongoose.model("categories", CategorySchema);
module.exports = Category;