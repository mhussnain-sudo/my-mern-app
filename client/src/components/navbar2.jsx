import { useEffect, useState } from 'react';
import { getEveryTournament, getPigeonResult } from '../apis/userApi';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

const Navbar2 = () => {

const baseurl = 'http://localhost:3000/';
    const [tournaments, setTournaments] = useState([]);
    const [selectedTournament, setSelectedTournament] = useState(null);
    const [pigeonResults, setPigeonResults] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);

    useEffect(() => {
        const fetchTournaments = async () => {
            try {
                const response = await getEveryTournament();
                if (response.tournaments && Array.isArray(response.tournaments)) {
                    setTournaments(response.tournaments);
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

    const handleDateSelect = (date) => {
        setSelectedDate(date);
    };

    const calculateTotalTime = (startTime, returnTimes) => {
        const [initialStartHours, initialStartMinutes] = startTime.split(":").map(Number);
        let totalDurationMs = 0; // Accumulate total duration in milliseconds

        returnTimes.forEach(returnTime => {
            const [returnHours, returnMinutes] = returnTime.split(":").map(Number);
            const returnDate = new Date();
            returnDate.setHours(returnHours, returnMinutes, 0);
            const startDate = new Date();
            startDate.setHours(initialStartHours, initialStartMinutes, 0);
            totalDurationMs += returnDate - startDate;
        });

        const totalHours = Math.floor(totalDurationMs / (1000 * 60 * 60));
        const totalMinutes = Math.floor((totalDurationMs % (1000 * 60 * 60)) / (1000 * 60));
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
                        ? selectedTournament.timeStart 
                        : 'Select a tournament to see the start time.'}
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
                                        <th className="border border-gray-300 p-2">Sr. No</th>
                                        <th className="border border-gray-300 p-2">Participants</th>
                                        <th className="border border-gray-300 p-2">Total Pigeons</th>
                                        {currentPigeonResults.pigeonResults
                                            .find(result => formatDate(result.date) === selectedDate)
                                            ?.results.map((res, index) => (
                                                <th key={res.pigeonNo} className="border border-gray-300 p-2">{`#${index + 1}`}</th>
                                            ))}
                                        <th className="border border-gray-300 p-2">Total Time</th>
                                    </tr>
                                </thead>
                                <tbody>
    {selectedTournament.participants.map((participant, pIndex) => {
        console.log(selectedTournament.participants)
        const resultsForDate = currentPigeonResults.pigeonResults
            .filter(result => formatDate(result.date) === selectedDate)
            .find(result => result.participantId === participant.id)?.results || [];

        // Collect all return times
        const returnTimes = resultsForDate.map(res => res.returnTime);

        // Calculate total time from tournament start to each return time
        const totalTime = calculateTotalTime(selectedTournament.timeStart, returnTimes);

        // Get the total number of pigeons for this participant
        const totalPigeons = resultsForDate.length;
        

        return (
            <tr key={pIndex}>
                <td className="border border-gray-300 p-2">{pIndex + 1}</td>
                <td className=" flex justify-center border  border-gray-300 p-2">
                    {participant.avatar ? (
                       
                        <img
                            src={`${baseurl}${participant.avatar}`}
                            alt={`${participant.userName}'s avatar`}
                            className="w-12 h-12 rounded-full mr-2"
                        />
                    ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-200 mr-2"></div> // Placeholder if avatar is null
                    )}
                    <div className=" flex flex-col">
                        <div>
                    {participant.userName}
                    </div>
                    <div>
                    {participant.phone}
                    </div>
                    </div>
                </td>
                <td className="border border-gray-300 p-2">{totalPigeons}</td>
                {resultsForDate.map((res, rIndex) => (
                    <td key={`${participant.name}-${rIndex}`} className="border border-gray-300 p-2">
                        {res.participantId === participant.id ? res.returnTime : "N/A"}
                    </td>
                ))}
                <td className="border border-gray-300 p-2">{totalTime}</td>
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
