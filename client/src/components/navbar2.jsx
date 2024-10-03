import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getPigeonResult } from '../apis/userApi';

const Navbar2 = ({ selectedTournament }) => {
    const baseurl = 'http://localhost:3000/';
    const [pigeonResults, setPigeonResults] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);

    useEffect(() => {
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

        fetchPigeonResults();
    }, []);

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
        let totalDurationMs = 0;

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
            <div className='flex flex-col md:flex-row gap-2'>
                <div className="flex flex-col md:flex-row w-full border rounded-[100px]  p-2 justify-start">
                    <div className='flex w-full md:w-2/3 items-center text-center px-4'>
                        <p>{selectedTournament.tournamentName}</p>
                    </div>
                    <div className="flex w-full md:w-1/3 items-center text-center gap-1 px-4">
                        <span>Start Time: </span>
                        <span>{selectedTournament.timeStart}</span>
                    </div>
                </div>
            </div>

            {selectedTournament && currentPigeonResults && (
                <div className="flex flex-col py-4 gap-1">
                    <div className="flex flex-wrap gap-1 m-3">
                        {currentPigeonResults.pigeonResults.map((pigeonResult, index) => {
                            const date = formatDate(pigeonResult.date);
                            return (
                                <button
                                    key={index}
                                    className={`p-2 border border-blue-600 rounded ${selectedDate === date ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 hover:bg-blue-600 hover:text-white'}`}
                                    onClick={() => handleDateSelect(date)}
                                >
                                    {date}
                                </button>
                            );
                        })}
                    </div>

                    {selectedDate && (
                        <div className="overflow-x-auto mb-4">
                            <table className="min-w-full border-collapse border text-center border-gray-300">
                                <thead>
                                    <tr className="bg-black">
                                        <th className="border border-gray-300 p-2 text-white">Sr. No</th>
                                        <th className="border border-gray-300 p-2 text-white">Participants</th>
                                        <th className="border border-gray-300 p-2 text-white">Total Pigeons</th>
                                        {currentPigeonResults.pigeonResults
                                            .find(result => formatDate(result.date) === selectedDate)
                                            ?.results.map((res, index) => (
                                                <th key={res.pigeonNo} className="border border-gray-300 p-2 text-white">{`#${index + 1}`}</th>
                                            ))}
                                        <th className="border border-gray-300 p-2 text-white">Total Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedTournament.participants.map((participant, pIndex) => {
                                        const resultsForDate = currentPigeonResults.pigeonResults
                                            .filter(result => formatDate(result.date) === selectedDate)
                                            .find(result => result.participantId === participant.id)?.results || [];

                                        const returnTimes = resultsForDate.map(res => res.returnTime);
                                        const totalTime = calculateTotalTime(selectedTournament.timeStart, returnTimes);
                                        const totalPigeons = resultsForDate.length;

                                        return (
                                            <tr key={pIndex}>
                                                <td className="border border-gray-300 p-2">{pIndex + 1}</td>
                                                <td className="flex flex-col md:flex-row content-center items-center justify-center border border-gray-300 p-2">
                                                    {participant.avatar ? (
                                                        <img
                                                            src={`${baseurl}${participant.avatar}`}
                                                            alt={`${participant.userName}'s avatar`}
                                                            className="w-12 h-12 rounded-full mr-2"
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-full bg-gray-200 mr-2"></div>
                                                    )}
                                                    <div className="flex flex-col">
                                                        <div>{participant.userName}</div>
                                                        <div>{participant.phone}</div>
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
