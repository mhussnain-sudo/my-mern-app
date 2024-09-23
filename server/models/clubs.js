const mongoose = require ('mongoose')

const {Schema} = mongoose;

const clubSchema = new Schema({
    ownerName: {
        type: String,
        required: true,
    },
    clubName: {
        type: String,
        required: true,
    },
    email: {
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