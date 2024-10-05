const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
    role: {
        type: String,
        enum: ["member", "admin"],
        default: 'member',
    },
    ID: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    ownerName: {
        type: String
    },
    avatar:{
        type: String,
    }
}, { timestamps: true });

const Users = mongoose.model("users", userSchema);
module.exports = Users;
