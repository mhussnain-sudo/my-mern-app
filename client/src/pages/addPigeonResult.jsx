import { useEffect, useState } from 'react';
import { addPigeonResult, getEveryTournament } from '../apis/userApi';
import { ToastContainer, toast } from 'react-toastify';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export default function AddPigeonResult() {
    const [tournaments, setTournaments] = useState([]);
    const [selectedTournament, setSelectedTournament] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [startTime, setStartTime] = useState('');
    const [numberOfPigeons, setNumberOfPigeons] = useState('');
    const [selectedName, setSelectedName] = useState(null);
    const [pigeonData, setPigeonData] = useState([]);
    const [continuousPigeonData, setContinuousPigeonData] = useState({});

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
                toast.error("Error fetching tournaments: " + error.message);
            }
        };

        fetchTournaments();
    }, []);


    const handleTournamentChange = (event, value) => {
        setSelectedTournament(value);
        if (value) {
            setStartTime(value.timeStart);
            setNumberOfPigeons(value.numberOfPigeons);
            setParticipants(value.participants || []);
            setSelectedName(null);

            const initialPigeonData = Array.from({ length: value.numberOfPigeons }, (_, i) => ({
                pigeonNo: `Pigeon No ${i + 1}`,
                returnTime: ''
            }));
            setPigeonData(initialPigeonData);
            setContinuousPigeonData({});
        } else {
            setStartTime('');
            setNumberOfPigeons('');
            setParticipants([]);
            setSelectedName(null);
            setPigeonData([]);
            setContinuousPigeonData({});
        }
    };

    const handlePigeonChange = (index, field, value) => {
        const updatedPigeonData = pigeonData.map((pigeon, i) => {
            if (i === index) {
                return { ...pigeon, [field]: value };
            }
            return pigeon;
        });
        setPigeonData(updatedPigeonData);
    };

    const handleContinuousPigeonChange = (dateId, index, field, value) => {
        setContinuousPigeonData((prevData) => ({
            ...prevData,
            [dateId]: {
                ...(prevData[dateId] || {}),
                [index]: {
                    ...(prevData[dateId]?.[index] || { pigeonNo: `Pigeon No ${index + 1}`, returnTime: '' }),
                    [field]: value
                }
            }
        }));
    };
    const handleFormSubmit = async () => {
        if (!selectedName || !selectedName.userName) {
            toast.error("Please select a valid participant.");
            return;
        }

        // Define mainPigeonResults
        const mainPigeonResults = pigeonData.map(pigeon => ({
            pigeonNo: pigeon.pigeonNo,
            returnTime: pigeon.returnTime
        }));

        // Define continuousResults
        const continuousResults = Object.entries(continuousPigeonData).map(([dateId, pigeons]) => {
            const dateObject = selectedTournament.continueDates.find(dateObj => dateObj._id === dateId);

            if (!dateObject) {
                return null; // Handle case where the date isn't found
            }

            const dateString = dateObject.date; // This is the continuous date
            return {
                date: dateString,
                results: Object.values(pigeons).map(pigeon => ({
                    pigeonNo: pigeon.pigeonNo,
                    returnTime: pigeon.returnTime
                }))
            };
        }).filter(Boolean); // Remove any null values

        const formattedResults = [
            {
                date: new Date(selectedTournament.date).toISOString().split('T')[0],
                results: mainPigeonResults
            },
            ...continuousResults
        ];

        console.log("Data being sent to API:", {
            tournamentName: selectedTournament?.tournamentName,
            userName: selectedName.userName,
            startTime,
            numberOfPigeons,
            results: formattedResults
        });

        try {
            await addPigeonResult(
                selectedTournament.tournamentName,
                selectedName.userName,
                startTime,
                numberOfPigeons,
                formattedResults
            );

            toast.success("Results created successfully!");
        } catch (error) {
            console.error("Error adding pigeon results:", error);
            toast.error("Error adding pigeon results: " + error.message);
        }
    };

    return (
        <div className="flex flex-col px-4 gap-10">
            <ToastContainer />
            <div className="border shadow-lg w-max p-3">
                <h1 className="font-bold font-mono text-2xl">Add Pigeon Result</h1>
            </div>
            <Autocomplete
                options={tournaments}
                getOptionLabel={(option) => option.tournamentName || ""}
                onChange={handleTournamentChange}
                renderInput={(params) => <TextField {...params} label="Tournament Name" />}
                style={{ marginBottom: '16px' }}
            />
            <TextField
                label="Start Time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                style={{ marginBottom: '16px' }}
                fullWidth
                disabled
            />
            <TextField
                label="Number of Pigeons"
                value={numberOfPigeons}
                onChange={(e) => setNumberOfPigeons(e.target.value)}
                style={{ marginBottom: '16px' }}
                fullWidth
                disabled
            />
            <Autocomplete
                options={participants}
                getOptionLabel={(option) => option.userName || ""}
                onChange={(event, value) => setSelectedName(value)}
                value={selectedName}
                renderInput={(params) => <TextField {...params} label="Participant Name" />}
                style={{ marginBottom: '16px' }}
                disabled={!selectedTournament}
            />
 {selectedTournament && (
                <div style={{ marginTop: '16px' }}>
                    <TextField
                        label="Start Date"
                        value={new Date(selectedTournament.date).toLocaleDateString()}
                        style={{ marginBottom: '8px' }}
                        fullWidth
                        disabled
                    />
                    {pigeonData.map((pigeon, index) => (
                        <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                            <TextField
                                label={`Pigeon No ${index + 1}`}
                                value={pigeon.pigeonNo}
                                onChange={(e) => handlePigeonChange(index, 'pigeonNo', e.target.value)}
                                style={{ flex: 1 }}
                                disabled
                            />
                            <TextField
                                label="Return Time"
                                type="time"
                                value={pigeon.returnTime}
                                onChange={(e) => handlePigeonChange(index, 'returnTime', e.target.value)}
                                style={{ flex: 1 }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                inputProps={{
                                    step: 300, // 5 min
                                }}
                            />
                        </div>
                    ))}


{selectedTournament.continueDates.map((dateObj) => (
                        <div key={dateObj._id} style={{ marginBottom: '16px' }}>
                            <TextField
                                label={`Continuous Date ${new Date(dateObj.date).toLocaleDateString()}`}
                                value={new Date(dateObj.date).toLocaleDateString()}
                                style={{ marginBottom: '8px' }}
                                fullWidth
                                disabled
                            />
                            {pigeonData.map((pigeon, index) => (
                                <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                    <TextField
                                        label={`Pigeon No ${index + 1}`}
                                        value={`Pigeon No ${index + 1}`} // This remains static
                                        disabled
                                    />
                                    <TextField
                                        label="Return Time"
                                        type="time"
                                        value={continuousPigeonData[dateObj._id]?.[index]?.returnTime || ''}
                                        onChange={(e) => handleContinuousPigeonChange(dateObj._id, index, 'returnTime', e.target.value)}
                                        style={{ flex: 1 }}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        inputProps={{
                                            step: 300, // 5 min
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}

            <Button variant="contained" onClick={handleFormSubmit} style={{ marginTop: '16px' }}>
                Submit
            </Button>
        </div>
    );
}

