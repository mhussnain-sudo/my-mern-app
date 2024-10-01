const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the schema for each prize
const prizeSchema = new Schema({
  name: {
    type: String,
    required: true, // Ensure each prize has a name
  }
});

// Define the schema for each continue date
const continueDateSchema = new Schema({

  date: {
    type: Date,
    required: true, // Ensure each date is required
  }
});
const participantsSchema = new Schema({
  member: {
    type: Schema.Types.ObjectId,
    ref: 'Pigeons',
  },
  avatar:{
    type:Schema.Types.String,
  },
  userName: {
    type: String,
    required: true, // Ensure the user name is saved
  },
  phone:{
    type:Schema.Types.String,
  }
});


// Main tournament schema
const tournamentSchema = new Schema({
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
},
  tournamentImage: {
    type: String,
    required: true // Path or URL for the tournament image
  },
  tournamentName: {
    type: String,
    required: true // Name of the tournament
  },
  tournamentInfo: {
    type: String,
    required: true // Description of the tournament
  },
  date: {
    type: Date,
    required: true // Date of the tournament
  },
  timeStart: {
    type: String, // Store as a string to accommodate time format (HH:MM)
    required: true // Start time of the tournament
  },
  numberOfPigeons: {
    type: Number,
    required: true,
    min: 0 // Ensure it's non-negative
  },
  numberOfHelperPigeons: {
    type: Number,
    required: true,
    min: 0 // Ensure it's non-negative
  },
  numberOfLoftedPigeons: {
    type: Number,
    required: true,
    min: 0 // Ensure it's non-negative
  },
  continueDays: {
    type: Number,
    required: true,
    min: 0,
    max: 30 // Limit the number of continuation days
  },
  continueDates: [continueDateSchema], // Use the continueDateSchema
  numberOfPrizes: {
    type: Number,
    required: true,
    min: 1,
    max: 15 // Validate the number of prizes
  },
  prizes: [prizeSchema], // Change to an array of prize objects
  participants: [participantsSchema],

}, { timestamps: true });




const Tournament = mongoose.model('Tournament', tournamentSchema);
module.exports = Tournament;
