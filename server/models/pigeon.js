const mongoose = require("mongoose");
const { Schema } = mongoose;

const pigeonSchema = new Schema({
    pigeonAvatar: {
        type: String
    },
    tournamentName: {
        type: String
    },
    name: {
        type: String
    },
    phone: {
        type: String
    },
    city: {
        type: String
    },
}, { timestamps: true });

const Pigeons = mongoose.model("pigeons", pigeonSchema);
module.exports = Pigeons;
