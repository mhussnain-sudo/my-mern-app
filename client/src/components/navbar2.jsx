import  { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getPigeonResult } from '../apis/userApi';

const Navbar2 = ({ selectedTournament }) => {
    const [pigeonResults, setPigeonResults] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [showTotal, setShowTotal] = useState(false); // State to toggle total results

    useEffect(() => {
        const fetchPigeonResults = async () => {
            try {
                const results = await getPigeonResult();
                if (results?.data && Array.isArray(results.data)) {
                    setPigeonResults(results.data);
                } else {
                    setPigeonResults([]);
                }
            } catch (error) {
                console.error("Error fetching pigeon results:", error);
                setPigeonResults([]);
            }
        };

        fetchPigeonResults();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return isNaN(date.getTime())
            ? "Invalid Date"
            : date.toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' });
    };

    const calculateDuration = (startTime, returnTime) => {
        const start = new Date(`1970-01-01T${startTime}Z`);
        const end = new Date(`1970-01-01T${returnTime}Z`);
        const totalMinutes = (end - start) / 60000; // convert milliseconds to minutes
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        return totalMinutes >= 0 ? `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}` : "00:00"; // return "00:00" if negative duration
    };

    // Filter pigeon results based on the selected tournament
    const filteredResults = pigeonResults.filter(result => result.tournamentName === selectedTournament.tournamentName);

    // Get unique dates for the buttons
    const uniqueDates = Array.from(new Set(filteredResults.flatMap(result => 
        result.pigeonResults.map(pigeonResult => formatDate(pigeonResult.date))
    )));

    // Filter results based on the selected date
    const dateFilteredResults = selectedDate ? filteredResults.map(result => ({
        ...result,
        pigeonResults: result.pigeonResults.filter(pigeonResult => 
            formatDate(pigeonResult.date) === selectedDate
        )
    })).filter(result => result.pigeonResults.length > 0) : [];

    // Handle displaying all results when "Total" is clicked
    const totalFilteredResults = showTotal ? filteredResults : [];

    const formatResultsForTable = (results) => {
        const participantMap = {};

        results.forEach(result => {
            result.pigeonResults.forEach(pigeonResult => {
                const participantName = result.name;

                if (!participantMap[participantName]) {
                    participantMap[participantName] = { pigeons: [], totalDuration: "00:00" }; // Initialize as "00:00"
                }

                pigeonResult.results.forEach(res => {
                    const duration = calculateDuration(selectedTournament.timeStart, res.returnTime);
                    participantMap[participantName].pigeons.push({
                        pigeonNo: res.pigeonNo,
                        returnTime: res.returnTime,
                        duration,
                    });

                    // Add duration to totalDuration
                    const [totalHours, totalMinutes] = participantMap[participantName].totalDuration.split(':').map(Number);
                    const [durationHours, durationMinutes] = duration.split(':').map(Number);

                    const newTotalMinutes = (totalHours * 60 + totalMinutes) + (durationHours * 60 + durationMinutes);
                    const newHours = Math.floor(newTotalMinutes / 60);
                    const newMinutes = newTotalMinutes % 60;

                    participantMap[participantName].totalDuration = `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
                });
            });
        });

        return participantMap;
    };

    const participantData = formatResultsForTable(selectedDate ? dateFilteredResults : totalFilteredResults);

    // Determine the maximum number of pigeons
    const maxPigeons = Math.max(...Object.values(participantData).map(data => data.pigeons.length), 0);

    return (
        <div className="flex flex-col p-4">
            <div className='flex flex-col md:flex-row gap-2'>
                <div className="flex flex-col md:flex-row w-full border rounded-[100px] p-2 justify-start">
                    <div className='flex w-full md:w-2/3 items-center text-center px-4'>
                        <p className="font-bold">{selectedTournament.tournamentName}</p>
                    </div>
                    <div className="flex w-full md:w-1/3 items-center text-center gap-1 px-4">
                        <span className='font-bold'>Start Time:</span>
                        <span className="font-bold">{selectedTournament.timeStart}</span>
                    </div>
                </div>
            </div>

            <div className="flex gap-2 my-2">
                {uniqueDates.map(date => (
                    <button
                        key={date}
                        onClick={() => {
                            setSelectedDate(date);
                            setShowTotal(false); // Reset showTotal when a date is selected
                        }}
                        className={`border border-blue-700 p-2 rounded ${selectedDate === date ? 'bg-blue-700 text-white' : 'bg-white text-blue-700 '}`}
                    >
                        {date}
                    </button>
                ))}
                {/* Total button */}
                <button
                    onClick={() => {
                        setSelectedDate(null);
                        setShowTotal(true); // Show total results
                    }}
                    className={`border p-2 rounded ${showTotal ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    Total
                </button>
            </div>

            {Object.keys(participantData).length > 0 && (
                <div className="mb-4">
                    <table className="min-w-full border-collapse border text-center border-gray-300">
                        <thead>
                            <tr className="bg-black text-white">
                                <th className="border border-gray-300 p-2">Sr</th>
                                <th className="border border-gray-300 p-2">Participant</th>
                                {Array.from({ length: maxPigeons }, (_, i) => (
                                    <th key={i} className="border border-gray-300 p-2">#{i + 1}</th>
                                ))}
                                <th className="border border-gray-300 p-2">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(participantData).map(([name, data], index) => (
                                <tr key={name}>
                                    <td className="border border-gray-300 p-2">{index + 1}</td> {/* Sr. No */}
                                    <td className="border border-gray-300 p-2">{name}</td>
                                    {data.pigeons.map(pigeon => (
                                        <td key={pigeon.pigeonNo} className="border border-gray-300 p-2">
                                            {pigeon.returnTime}
                                        </td>
                                    ))}
                                    {/* Fill remaining cells if less than max pigeons */}
                                    {Array.from({ length: maxPigeons - data.pigeons.length }, (_, i) => (
                                        <td key={i} className="border border-gray-300 p-2"></td>
                                    ))}
                                    <td className="border border-gray-300 p-2">{data.totalDuration}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

// Prop Types validation
Navbar2.propTypes = {
    selectedTournament: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        tournamentName: PropTypes.string.isRequired,
        timeStart: PropTypes.string.isRequired,
        participants: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.string.isRequired,
                userName: PropTypes.string.isRequired,
                avatar: PropTypes.string,
                phone: PropTypes.string,
            })
        ).isRequired,
    }).isRequired,
};

export default Navbar2;
