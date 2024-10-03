import { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FormTournamentComponent = ({ onSubmit, fields, numberOfPrizes, setNumberOfPrizes, setPrizes, prizes }) => {
    const [formData, setFormData] = useState({});
    const [imagePreview, setImagePreview] = useState(null);
    const [continueDays, setContinueDays] = useState(0);
    const [selectedDates, setSelectedDates] = useState([]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;

        if (type === 'file') {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreview(reader.result);
                };
                reader.readAsDataURL(file);
                setFormData({ ...formData, [name]: file });
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleContinueDaysChange = (e) => {
        const days = e.target.value;
        const parsedDays = parseInt(days, 10);

        if (parsedDays > 30) {
            toast.error("Can't continue more than 30 days. Resetting to 0 days.");
            setContinueDays(0);
            setSelectedDates([]);
        } else {
            setContinueDays(parsedDays);
            setSelectedDates(Array.from({ length: parsedDays }, () => ''));
        }
    };



    const handlePrizeChange = (e) => {
        const value = e.target.value;
        const parsedValue = parseInt(value, 10);

        if (value === '') {
            setNumberOfPrizes('');
            setPrizes(['']); // Reset prizes if the input is empty
        } else if (parsedValue >= 1 && parsedValue <= 15) {
            setNumberOfPrizes(parsedValue);
            setPrizes(Array.from({ length: parsedValue }, (_, index) => prizes[index] || ''));
        } else if (parsedValue > 15) {
            toast.error("You can't add more than 15 prizes.");
            setPrizes(prevPrizes => Array.from({ length: numberOfPrizes }, (_, index) => prevPrizes[index] || ''));
        } else {
            setPrizes(prevPrizes => Array.from({ length: numberOfPrizes }, (_, index) => prevPrizes[index] || ''));
        }
    };

    const handleDateChange = (index, value) => {
        const newDates = [...selectedDates];
        newDates[index] = value; // Date strings should be valid
        setSelectedDates(newDates);
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ ...formData, continueDays, continueDates: selectedDates, prizes });
        setFormData({});
        setImagePreview(null);
        setContinueDays(0);
        setSelectedDates([]);
        setNumberOfPrizes(''); // Reset to empty after submission
        setPrizes(['']); // Reset prizes
    };

    const handleFocus = (e) => {
        e.target.showPicker();
    };


    return (
        <form className="flex flex-col p-4 justify-center items-center gap-2" onSubmit={handleSubmit}>
            {fields.map((field) => (
                field.type === 'file' ? (
                    <div key={field.name} className="w-full md:w-3/4">
                        <label className="block mb-2 text-gray-700">Upload Tournament Image</label>
                        <div
                            className={`border-dashed border-2 border-blue-500 rounded-md h-40 flex justify-center items-center cursor-pointer ${imagePreview ? 'bg-gray-100' : ''}`}
                            onClick={() => document.getElementById(field.name).click()}
                        >
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="h-full w-full object-contain rounded-md"
                                />
                            ) : (
                                <span className="text-gray-500">Click to upload image</span>
                            )}
                        </div>
                        <input
                            type="file"
                            id={field.name}
                            name={field.name}
                            accept="image/*"
                            onChange={handleChange}
                            className="hidden"
                        />
                    </div>
                ) : (
                    <TextField
                        variant="outlined"
                        size="small"
                        key={field.name}
                        type={field.type}
                        name={field.name}
                        label={field.placeholder}
                        value={formData[field.name] || ''}
                        onChange={handleChange}
                        onFocus={field.type === 'date' || field.type === 'time' ? handleFocus : null}
                        required
                        className="w-full md:w-3/4"
                    />
                )
            ))}

    {/* Max Prizes Input */}
    <TextField
                variant="outlined"
                size="small"
                type="number"
                label="Enter No. Of Prizes"
                value={numberOfPrizes} // Keep this controlled
                onChange={handlePrizeChange}
                required
                inputProps={{ min: 1, max: 15 }} // Set min and max for input
                className="w-full md:w-3/4"
            />

            {/* Render Prize Fields */}
            {Array.from({ length: numberOfPrizes }).map((_, index) => (
                <TextField
                    key={`prize-${index}`}
                    variant="outlined"
                    size="small"
                    type="text"
                    name={`prize${index + 1}`}
                    label={`Enter Prize ${index + 1}`}
                    value={prizes[index] || ''}
                    onChange={(e) => {
                        const updatedPrizes = [...prizes];
                        updatedPrizes[index] = e.target.value;
                        setPrizes(updatedPrizes);
                    }}
                    required
                    className="w-full md:w-3/4"
                />
            ))}

            {/* Continue Days Input */}
            <TextField
                variant="outlined"
                size="small"
                type="number"
                label="Continue Days"
                value={continueDays}
                onChange={handleContinueDaysChange}
                required
                className="w-full md:w-3/4"
            />

            {/* Selected Dates Fields */}
            {Array.from({ length: continueDays }).map((_, index) => (
                <TextField
                    key={index}
                    variant="outlined"
                    size="small"
                    type="date"
                    value={selectedDates[index] || ''}
                    onChange={(e) => handleDateChange(index, e.target.value)}
                    onFocus={handleFocus}
                    required
                    className="w-full md:w-3/4"
                />
            ))}

            <Button variant="contained" type="submit" className="mt-4">Submit</Button>
            <ToastContainer /> {/* Add ToastContainer to the form */}
        </form>
    );
};

// Define prop types
FormTournamentComponent.propTypes = {
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

export default FormTournamentComponent;

