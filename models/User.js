const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        name: {
            type: Schema.Types.String,
            required: true,
            defaults: null
        },
        phone: {
            type: Schema.Types.String,
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

let User = mongoose.model("users", UserSchema);
module.exports = User;