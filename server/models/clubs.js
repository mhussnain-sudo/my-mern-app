const mongoose = require ('mongoose')

const {Schema} = mongoose;

const clubSchema = new Schema({
    clubAvatar:{
        type: String,
    },
    ownerName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const Club = mongoose.model('clubs',clubSchema);
module.exports = Club

