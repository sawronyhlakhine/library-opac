const mongoose = require('mongoose');
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

let Category = mongoose.model("categories", CategorySchema);
module.exports = Category;