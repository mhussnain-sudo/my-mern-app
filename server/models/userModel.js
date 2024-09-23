const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  
    role: {
        type: String,
        enum: ["viewer", "admin"]
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    name: {
        type: String
    },
}, { timestamps: true });

const Users = mongoose.model("users", userSchema);
module.exports = Users;
