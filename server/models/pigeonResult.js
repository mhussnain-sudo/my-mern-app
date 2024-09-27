const mongoose = require("mongoose");
const { Schema } = mongoose;

const pigeonResultSchema = new Schema({
    pigeonNo: {
        type: String,
        required: true // Ensuring this field is required
    },
    returnTime: {
        type: String,
        required: true // Ensuring this field is required
    }
}, { _id: false }); // Disable automatic ID generation for nested schema

const dailyResultsSchema = new Schema({
    date: {
        type: String,
        required: true // Ensuring this field is required
    },
    results: [pigeonResultSchema] // Array of results for each pigeon
}, { _id: false }); // Disable automatic ID generation for nested schema

const pigeonSchema = new Schema({
    tournamentName: {
        type: String,
        required: true // Optional: Set to true if you want to enforce this field
    },
    name: {
        type: String,
        required: true // Optional: Set to true if you want to enforce this field
    },
    startTime: {
        type: String,
        required: true // Optional: Set to true if you want to enforce this field
    },
    numberOfPigeons: {
        type: Number, // Change this to Number type for numeric operations
        required: true // Optional: Set to true if you want to enforce this field
    },
    pigeonResults: [dailyResultsSchema], // Changed to an array of dailyResultsSchema
}, { timestamps: true });

const Pigeons = mongoose.model("pigeons", pigeonSchema);
module.exports = Pigeons;
