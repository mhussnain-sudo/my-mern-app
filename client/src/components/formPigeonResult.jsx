import { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FormPigeonComponent = ({ onSubmit, fields }) => {
    const [formData, setFormData] = useState({});
    const [dailyResults, setDailyResults] = useState([{ date: '', results: [{ pigeonNo: '', returnTime: '' }] }]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleResultChange = (dayIndex, resultIndex, e) => {
        const { name, value } = e.target;
        const newResults = [...dailyResults];
        newResults[dayIndex].results[resultIndex][name] = value;
        setDailyResults(newResults);
    };

    const handleAddResult = (dayIndex) => {
        const newResults = [...dailyResults];
        newResults[dayIndex].results.push({ pigeonNo: '', returnTime: '' });
        setDailyResults(newResults);
    };

    const handleAddDay = () => {
        setDailyResults([...dailyResults, { date: '', results: [{ pigeonNo: '', returnTime: '' }] }]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ ...formData, pigeonResults: dailyResults });
        setFormData({});
        setDailyResults([{ date: '', results: [{ pigeonNo: '', returnTime: '' }] }]); // Reset daily results
    };


    return (
        <form className="flex flex-col p-4 justify-center items-center gap-2" onSubmit={handleSubmit}>
            {fields.map((field) => (
                <TextField
                    variant="outlined"
                    size="small"
                    key={field.name}
                    type={field.type}
                    name={field.name}
                    label={field.placeholder}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    required
                    className="w-full md:w-3/4"
                />
            ))}

            {dailyResults.map((day, dayIndex) => (
                <div key={dayIndex} className="mb-4">
                    <TextField
                        variant="outlined"
                        size="small"
                        name={`date-${dayIndex}`}
                        label={`Date for Day ${dayIndex + 1}`}
                        type="date"
                        value={day.date}
                        onChange={(e) => {
                            const newResults = [...dailyResults];
                            newResults[dayIndex].date = e.target.value;
                            setDailyResults(newResults);
                        }}
                        required
                        className="w-full md:w-3/4 mb-2"
                    />
 {day.results.map((result, resultIndex) => (
                        <div key={resultIndex} className="flex gap-2">
                            <TextField
                                variant="outlined"
                                size="small"
                                name="pigeonNo"
                                label="Pigeon No"
                                value={result.pigeonNo}
                                onChange={(e) => handleResultChange(dayIndex, resultIndex, e)}
                                required
                                className="w-full md:w-3/4"
                            />
                            <TextField
                                variant="outlined"
                                size="small"
                                name="returnTime"
                                label="Return Time"
                                type="time"
                                value={result.returnTime}
                                onChange={(e) => handleResultChange(dayIndex, resultIndex, e)}
                                required
                                className="w-full md:w-3/4"
                            />
                        </div>
                    ))}
                    <Button variant="outlined" onClick={() => handleAddResult(dayIndex)} className="mt-2">
                        Add Result
                    </Button>
                </div>
            ))}
            <Button variant="outlined" onClick={handleAddDay} className="mt-4">
                Add Day
            </Button>
            <Button variant="contained" type="submit" className="mt-4">Submit</Button>
            <ToastContainer />
        </form>
    );
};


// Define prop types
FormPigeonComponent.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    fields: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            type: PropTypes.string.isRequired,
            placeholder: PropTypes.string,
        })
    ).isRequired,
    numberOfPrizes: PropTypes.number.isRequired,
    setNumberOfPrizes: PropTypes.func.isRequired,
    setPrizes: PropTypes.func.isRequired,
    prizes: PropTypes.array.isRequired,
};

export default FormPigeonComponent;

