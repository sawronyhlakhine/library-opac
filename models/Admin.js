const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdminSchema = new Schema(
    {
        username: {
            type: Schema.Types.String,
            required: true,
        },

        email: {
            type: Schema.Types.String,
            required: true,
        },
        password: {
            type: Schema.Types.String,
            required: true,
        },
        logged_out_at: {
            type: Schema.Types.Date,
            defaults: null 
        },
    },
    {
        timestamps:  { 
            createdAt: "created_at",
            updatedAt: "updated_at"
        }
    }
);

let Admin = mongoose.model("admins", AdminSchema);
module.exports = Admin;