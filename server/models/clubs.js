const mongoose = require ('mongoose')

const {Schema} = mongoose;

const clubSchema = new Schema({
    role:{
        type: String,
        default: "member",
    },
    clubAvatar:{
        type: String,
    },
    ownerName: {
        type: String,
        required: true,
    },
    ID:{
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const Club = mongoose.model('clubs',clubSchema);
module.exports = Club

