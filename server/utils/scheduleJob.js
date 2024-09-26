const cron = require('node-cron');
const mongoose = require('mongoose');
const Tournament = require('../models/tournament'); // Adjust the path as needed
const DB = require('../config/dbconnect');

const updateTournamentStatuses = async () => {
    console.log("Checking for tournaments to update...");
    try {
        const currentDate = new Date();

        // Find tournaments where the last continue date has passed
        const tournamentsToUpdate = await Tournament.find({
            status: 'active' // Only check active tournaments
        });

        for (const tournament of tournamentsToUpdate) {
            // Get the last continue date from the continueDates array
            const lastContinueDate = tournament.continueDates.length > 0
                ? new Date(Math.max(...tournament.continueDates.map(cd => new Date(cd.date))))
                : null;

            // Check if the last continue date has passed
            if (lastContinueDate && lastContinueDate < currentDate) {
                tournament.status = 'inactive';
                await tournament.save();
                console.log(`Tournament ${tournament.tournamentName} set to inactive.`);
            }
        }
    } catch (error) {
        console.error("Error updating tournament statuses:", error);
    }
};

// Function to schedule the job
const scheduleJobs = () => {
    if (!mongoose.connection.readyState) {
        DB(); // Connect to the database only if not connected
    }
    cron.schedule('0 0 * * *', updateTournamentStatuses);
    console.log('Scheduled job is running. It will check for inactive tournaments every midnight.');
};

// Export the functions
module.exports = { scheduleJobs };
