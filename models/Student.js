const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const StudentSchema = new Schema(
    {
        name: {
            type: Schema.Types.String,
            required: true,
            defaults: null
        },
        phone: {
            type: Schema.Types.String,
            required: false,
            defaults: null
        },
        email: {
            type: Schema.Types.String,
            required: true,
            defaults: null
        },
        address: {
            type: Schema.Types.String,
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

StudentSchema.plugin(mongoosePaginate);
let Student = mongoose.model("students", StudentSchema);
module.exports = Student;