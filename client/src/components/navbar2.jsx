import { useEffect, useState } from 'react';
import { getEveryTournament, getPigeonResult } from '../apis/userApi';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

const Navbar2 = () => {
    const [tournaments, setTournaments] = useState([]);
    const [selectedTournament, setSelectedTournament] = useState(null);
    console.log(selectedTournament);
    const [pigeonResults, setPigeonResults] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);

    useEffect(() => {
        const fetchTournaments = async () => {
            try {
                const response = await getEveryTournament();
                if (response.tournaments && Array.isArray(response.tournaments)) {
                    setTournaments(response.tournaments);
                    console.log(response.tournaments);
                } else {
                    setTournaments([]);
                }
            } catch (error) {
                console.error("Error fetching tournaments:", error);
            }
        };

        const fetchPigeonResults = async () => {
            try {
                const results = await getPigeonResult();
                if (results && results.data && Array.isArray(results.data)) {
                    setPigeonResults(results.data);
                } else {
                    setPigeonResults([]);
                }
            } catch (error) {
                console.error("Error fetching pigeon results:", error);
                setPigeonResults([]);
            }
        };

        fetchTournaments();
        fetchPigeonResults();
    }, []);

    const handleTournamentChange = (event, value) => {
        setSelectedTournament(value);
        setSelectedDate(null); // Reset selected date when changing tournament
    };

    const currentPigeonResults = selectedTournament
        ? pigeonResults.find(result => result.tournamentName === selectedTournament.tournamentName)
        : null;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return isNaN(date.getTime())
            ? "Invalid Date"
            : date.toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' });
    };

    const formatReturnTime = (timeString) => {
        if (!timeString) return "Invalid Time";

        const [hours, minutes] = timeString.split(":").map(Number);
        const date = new Date();
        date.setHours(hours, minutes, 0);
        
        return isNaN(date.getTime())
            ? "Invalid Time"
            : date.toLocaleString(undefined, { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    const handleDateSelect = (date) => {
        setSelectedDate(date);
    };
    const calculateTotalTime = (startTime, returnTimes) => {
        const [initialStartHours, initialStartMinutes] = startTime.split(":").map(Number);
        let totalDurationMs = 0; // Accumulate total duration in milliseconds
        let startHours = initialStartHours; // Use let for mutable variables
        let startMinutes = initialStartMinutes;
    
        returnTimes.forEach(returnTime => {
            const [returnHours, returnMinutes] = returnTime.split(":").map(Number);
            
            // Create a date for the return time
            const returnDate = new Date();
            returnDate.setHours(returnHours, returnMinutes, 0);
            
            // Calculate duration from startTime to this returnTime
            const startDate = new Date();
            startDate.setHours(startHours, startMinutes, 0);
            
            // Calculate the duration in milliseconds
            totalDurationMs += returnDate - startDate;
    
            // Update startHours and startMinutes to the last return time for the next iteration
            startHours = returnHours;
            startMinutes = returnMinutes;
        });
    
        const totalHours = Math.floor((totalDurationMs / (1000 * 60 * 60)) % 24);
        const totalMinutes = Math.floor((totalDurationMs / (1000 * 60)) % 60);
        return `${totalHours}h ${totalMinutes}m`;
    };
    

    return (
        <div className="flex flex-col p-4">
            <div>
                <Autocomplete
                    options={tournaments}
                    getOptionLabel={(option) => option.tournamentName || ""}
                    onChange={handleTournamentChange}
                    renderInput={(params) => <TextField {...params} label="Select Tournament" />}
                    style={{ marginBottom: '16px' }}
                />
            </div>
            <div className="flex flex-col text-center mb-4">
                <h2 className="text-lg font-semibold">Start Time</h2>
                <p className="text-blue-600 font-bold text-4xl">
                    {selectedTournament 
                        ? formatReturnTime(selectedTournament.timeStart) 
                        : 'Select a tournament to see the start time.'
                    }
                </p>
            </div>

            {selectedTournament && currentPigeonResults && (
                <div>
                    {/* Date Navigation Bar */}
                    <div className="flex space-x-2 mb-4">
                        {currentPigeonResults.pigeonResults.map((pigeonResult, index) => {
                            const date = formatDate(pigeonResult.date);
                            return (
                                <button
                                    key={index}
                                    className={`p-2 border rounded ${selectedDate === date ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'}`}
                                    onClick={() => handleDateSelect(date)}
                                >
                                    {date}
                                </button>
                            );
                        })}
                    </div>

                    {/* Pigeon Results Table */}
                    {selectedDate && (
                        <div className="overflow-x-auto mb-4">
                            <table className="min-w-full border-collapse border text-center border-gray-300">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border border-gray-300 p-2">Sr.   
 No.</th>
                                        <th className="border border-gray-300 p-2">Participants</th>
                                        <th className="border border-gray-300 p-2">Total Pigeons</th>
                                        {currentPigeonResults.pigeonResults
                                            .find(result => formatDate(result.date) === selectedDate)
                                            ?.results.map(res => (
                                                <th key={res.pigeonNo} className="border border-gray-300 p-2">{res.pigeonNo}</th>
                                            ))}
                                        <th className="border border-gray-300 p-2">Total Time</th>
                                    </tr>
                                </thead>
                                <tbody>
    {selectedTournament.participants.map((participant, pIndex) => {
        console.log(participant);
        
        // Get results for the selected date
        const resultsForDate = currentPigeonResults.pigeonResults
            .filter(result => formatDate(result.date) === selectedDate) // Filter results by date
            .find(result => result.participantId === participant.id)?.results || []; // Find results for this participant

        // Collect all return times
        const returnTimes = resultsForDate.map(res => res.returnTime);

        // Calculate total time from tournament start to each return time
        const totalTime = calculateTotalTime(selectedTournament.timeStart, returnTimes);

        // Get the total number of pigeons for this participant
        const totalPigeons = resultsForDate.length;

        return (
            <tr key={pIndex}>
                <td className="border border-gray-300 p-2">
                    {pIndex + 1} {/* Displaying Sr. No. */}
                </td>
                <td className="border border-gray-300 p-2">
                    {participant.userName} {/* Displaying participant name */}
                </td>
                <td className="border border-gray-300 p-2">{totalPigeons}</td> {/* Display Total Pigeons */}
                {resultsForDate.map((res, rIndex) => (
                    <td key={`${participant.name}-${rIndex}`} className="border border-gray-300 p-2">
                        {/* Check if this participant has this pigeon result */}
                        {res.participantId === participant.id ? formatReturnTime(res.returnTime) : "N/A"}
                    </td>
                ))}
                <td className="border border-gray-300 p-2">{totalTime}</td> {/* Display Total Time */}
            </tr>
        );
    })}
</tbody>


                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Navbar2;